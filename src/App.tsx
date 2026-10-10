import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CollectionGrid } from './components/CollectionGrid';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InquiryModal } from './components/InquiryModal';
import { SearchModal } from './components/SearchModal';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { storage } from './services/storage';
import { authService } from './services/auth';
import { cloudDb } from './services/firebase';
import { Product, SiteContent, CustomerInquiry } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => storage.getProducts());
  const [content, setContent] = useState<SiteContent>(() => storage.getContent());
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => storage.getInquiries());
  const [selectedCategory, setSelectedCategory] = useState<string>('All Jewelry');

  // Currency selection
  const [currency, setCurrency] = useState<'PKR' | 'USD'>(() => content.currency || 'PKR');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryProductContext, setInquiryProductContext] = useState<Product | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  // Always start with refresh: reset admin authentication on every page load/refresh
  useEffect(() => {
    authService.logout();
  }, []);

  // Multi-device real-time sync & fresh load guarantee with Cloud Firestore
  useEffect(() => {
    // 1. Purge any outdated versioned localStorage to prevent stale cache contamination
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('moonlit_') && !key.includes('_v12')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {}

    // 2. Initialize cloud catalog if Firestore is empty on first boot
    cloudDb.initializeIfEmpty(storage.getProducts(), storage.getContent());

    // 3. Immediately fetch fresh data straight from Cloud Firestore servers (bypassing any device cache)
    cloudDb.fetchFreshServerData().then(({ products: freshProducts, content: freshContent }) => {
      if (freshProducts && freshProducts.length > 0) {
        setProducts(freshProducts);
        storage.saveProducts(freshProducts);
      }
      if (freshContent) {
        setContent(freshContent);
        storage.saveContent(freshContent);
      }
    });

    // 4. Real-time subscription to cloud products
    const unsubProducts = cloudDb.subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
        storage.saveProducts(cloudProducts);
      }
    });

    // 5. Real-time subscription to cloud site branding and content
    const unsubContent = cloudDb.subscribeToSiteContent((cloudContent) => {
      if (cloudContent) {
        setContent(cloudContent);
        storage.saveContent(cloudContent);
      }
    });

    // 6. Real-time subscription to cloud inquiries
    const unsubInquiries = cloudDb.subscribeToInquiries((cloudInquiries) => {
      if (cloudInquiries) {
        setInquiries(cloudInquiries);
      }
    });

    return () => {
      unsubProducts();
      unsubContent();
      unsubInquiries();
    };
  }, []);

  // Sync state changes with document title
  useEffect(() => {
    document.title = content.seoTitle || `${content.brandName} — Real Jewelry. Timeless Beauty.`;
  }, [content.seoTitle, content.brandName]);

  const handleToggleCurrency = () => {
    setCurrency((prev) => (prev === 'PKR' ? 'USD' : 'PKR'));
  };

  const handleOpenInquiry = (product?: Product | string) => {
    if (typeof product === 'string') {
      const found = products.find((p) => p.id === product);
      setInquiryProductContext(found || null);
    } else if (product) {
      setInquiryProductContext(product);
    } else {
      setInquiryProductContext(null);
    }
    setInquiryModalOpen(true);
  };

  const handleOpenAdmin = () => {
    setAdminLoginOpen(true);
  };

  const handleAdminLoginSuccess = () => {
    setAdminLoginOpen(false);
    setAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    authService.logout();
    setAdminDashboardOpen(false);
  };

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    storage.saveProducts(newProducts);
    cloudDb.saveAllProducts(newProducts).catch((err) => {
      console.error('Failed to sync products to Firestore:', err);
    });
  };

  const handleSaveContent = (newContent: SiteContent) => {
    setContent(newContent);
    storage.saveContent(newContent);
    cloudDb.saveSiteContent(newContent).catch((err) => {
      console.error('Failed to sync content to Firestore:', err);
    });
  };

  const handleInquirySubmitted = (newInquiry: CustomerInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
    storage.saveInquiry(newInquiry);
    cloudDb.saveInquiry(newInquiry).catch((err) => {
      console.error('Failed to sync inquiry to Firestore:', err);
    });
  };

  const handleForceRefresh = () => {
    try {
      // Clear old caches
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('moonlit_') && !key.includes('_v12')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.removeItem('moonlit_auto_fresh_v2');
    } catch (e) {}

    // Reload with fresh timestamp to bypass any device HTTP cache
    const url = new URL(window.location.href);
    url.searchParams.set('_fresh', Date.now().toString());
    window.location.replace(url.toString());
  };

  const scrollToCollection = () => {
    const el = document.getElementById('collection-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#fffbe8] text-black flex flex-col font-sans selection:bg-[#E8DFC8]">
      {/* Primary Header */}
      <Header
        content={content}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenAdmin={handleOpenAdmin}
        onOpenInquiry={() => handleOpenInquiry()}
        onOpenSearch={() => setSearchModalOpen(true)}
        onRefresh={handleForceRefresh}
        inquiryCount={inquiries.filter((i) => i.status === 'new').length}
        currency={currency}
        onToggleCurrency={handleToggleCurrency}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          content={content}
          onExplore={scrollToCollection}
          onContact={() => handleOpenInquiry()}
        />

        {/* Collection & Catalog Filter Grid */}
        <CollectionGrid
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          currency={currency}
          pkrToUsdRate={content.pkrToUsdRate || 278}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onInquireProduct={(p) => handleOpenInquiry(p)}
        />
      </main>

      {/* Footer */}
      <Footer
        content={content}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCollection();
        }}
        onOpenAdmin={handleOpenAdmin}
        onOpenInquiry={() => handleOpenInquiry()}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onInquire={(p) => handleOpenInquiry(p)}
          currency={currency}
          pkrToUsdRate={content.pkrToUsdRate || 278}
          content={content}
        />
      )}

      {/* Inquiry / Bespoke Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        selectedProduct={inquiryProductContext}
        content={content}
        onInquirySubmitted={handleInquirySubmitted}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        currency={currency}
        pkrToUsdRate={content.pkrToUsdRate || 278}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Dashboard */}
      {adminDashboardOpen && (
        <AdminDashboard
          products={products}
          content={content}
          onSaveProducts={handleSaveProducts}
          onSaveContent={handleSaveContent}
          onClose={() => setAdminDashboardOpen(false)}
          onLogout={handleAdminLogout}
        />
      )}
    </div>
  );
}
