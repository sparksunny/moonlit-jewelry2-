import { Product, SiteContent, CustomerInquiry } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_SITE_CONTENT } from '../data/initialContent';

const STORAGE_KEYS = {
  PRODUCTS: 'moonlit_products_v5',
  CONTENT: 'moonlit_site_content_v5',
  INQUIRIES: 'moonlit_inquiries_v5',
  CATEGORIES: 'moonlit_categories_v5'
};

export const storage = {
  getProducts(): Product[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to localStorage', e);
    }
  },

  getContent(): SiteContent {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_SITE_CONTENT, ...parsed };
      }
    } catch (e) {
      console.error('Error loading content from localStorage', e);
    }
    return INITIAL_SITE_CONTENT;
  },

  saveContent(content: SiteContent): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(content));
    } catch (e) {
      console.error('Error saving content to localStorage', e);
    }
  },

  getInquiries(): CustomerInquiry[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading inquiries', e);
    }
    return [
      {
        id: 'inq-default-1',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        fullName: 'Ayesha Rahman',
        email: 'ayesha.r@example.com',
        phone: '+1 716-555-0192',
        productId: 'moonlit-8433578836015',
        productName: 'Moonlit Jewelry Elegant Pear Cut Halo Ring',
        message: 'Interested in bespoke sizing (US 6.5) in 925 sterling silver with custom engraving.',
        status: 'new'
      }
    ];
  },

  saveInquiry(inquiry: Omit<CustomerInquiry, 'id' | 'date' | 'status'>): CustomerInquiry {
    const list = this.getInquiries();
    const newInquiry: CustomerInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: 'new'
    };
    const updated = [newInquiry, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving inquiry', e);
    }
    return newInquiry;
  },

  updateInquiryStatus(id: string, status: CustomerInquiry['status']): void {
    const list = this.getInquiries().map((item) =>
      item.id === id ? { ...item, status } : item
    );
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(list));
    } catch (e) {
      console.error('Error updating inquiry status', e);
    }
  },

  resetAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.CONTENT);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    } catch (e) {
      console.error('Error resetting storage', e);
    }
  }
};
