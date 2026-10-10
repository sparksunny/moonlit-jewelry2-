import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  getDoc,
  setDoc,
  writeBatch,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, SiteContent, CustomerInquiry } from '../types';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Operational Error Handling conforming to firebase-integration-rpc requirements
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on app load
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline; falling back to local cache.');
    }
  }
}
testConnection();

// Cloud Data Services for multi-device sync
export const cloudDb = {
  /**
   * Real-time subscription to products collection.
   * Any change made on any device immediately pushes to all listeners.
   */
  subscribeToProducts(callback: (products: Product[]) => void): () => void {
    const collRef = collection(db, 'products');
    return onSnapshot(
      collRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as Product);
          });
          callback(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'products');
      }
    );
  },

  /**
   * Real-time subscription to global site content (branding, phone, slogan, hero, etc.)
   */
  subscribeToSiteContent(callback: (content: SiteContent) => void): () => void {
    const docRef = doc(db, 'site_content', 'global');
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as SiteContent);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'site_content/global');
      }
    );
  },

  /**
   * Real-time subscription to inquiries
   */
  subscribeToInquiries(callback: (inquiries: CustomerInquiry[]) => void): () => void {
    const collRef = collection(db, 'inquiries');
    return onSnapshot(
      collRef,
      (snapshot) => {
        const list: CustomerInquiry[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as CustomerInquiry);
        });
        callback(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'inquiries');
      }
    );
  },

  /**
   * Save a single product to Cloud Firestore
   */
  async saveProduct(product: Product): Promise<void> {
    const path = `products/${product.id}`;
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Save an entire array of products to Cloud Firestore in batches
   */
  async saveAllProducts(products: Product[]): Promise<void> {
    try {
      const batchSize = 450;
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = writeBatch(db);
        const slice = products.slice(i, i + batchSize);
        slice.forEach((p) => {
          batch.set(doc(db, 'products', p.id), p);
        });
        await batch.commit();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  },

  /**
   * Save site content to Cloud Firestore
   */
  async saveSiteContent(content: SiteContent): Promise<void> {
    const path = 'site_content/global';
    try {
      await setDoc(doc(db, 'site_content', 'global'), content);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Save customer inquiry to Cloud Firestore
   */
  async saveInquiry(inquiry: CustomerInquiry): Promise<void> {
    const path = `inquiries/${inquiry.id}`;
    try {
      await setDoc(doc(db, 'inquiries', inquiry.id), inquiry);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  /**
   * Initialize Firestore with baseline catalog if cloud collection is currently empty
   */
  async initializeIfEmpty(
    fallbackProducts: Product[],
    fallbackContent: SiteContent
  ): Promise<boolean> {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (snap.empty) {
        console.info('Seeding Cloud Firestore with catalog for cross-device synchronization...');
        await this.saveAllProducts(fallbackProducts);

        const contentDoc = await getDoc(doc(db, 'site_content', 'global'));
        if (!contentDoc.exists()) {
          await this.saveSiteContent(fallbackContent);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Initial cloud verification fallback:', error);
      return false;
    }
  }
};

export default app;
