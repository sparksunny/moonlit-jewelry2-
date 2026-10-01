import React, { useState } from 'react';
import {
  X,
  Plus,
  Save,
  Trash2,
  Copy,
  Edit,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Type,
  List,
  MessageSquare,
  RotateCcw,
  LogOut,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Search,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Product, SiteContent, CustomerInquiry } from '../../types';
import { storage } from '../../services/storage';
import { authService } from '../../services/auth';

interface AdminDashboardProps {
  products: Product[];
  content: SiteContent;
  onSaveProducts: (products: Product[]) => void;
  onSaveContent: (content: SiteContent) => void;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products: initialProducts,
  content: initialContent,
  onSaveProducts,
  onSaveContent,
  onClose,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'images' | 'text' | 'pricing' | 'inquiries'>('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => storage.getInquiries());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Editing single product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Status banners
  const [notification, setNotification] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // --- SAVE SYSTEM ---
  const handleSaveChanges = () => {
    storage.saveProducts(products);
    storage.saveContent(content);
    onSaveProducts(products);
    onSaveContent(content);
    showNotice('Changes saved successfully.');
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all products and content back to the original demonstration catalog? Any custom edits will be reverted.')) {
      storage.resetAll();
      const resetProds = storage.getProducts();
      const resetCont = storage.getContent();
      setProducts(resetProds);
      setContent(resetCont);
      onSaveProducts(resetProds);
      onSaveContent(resetCont);
      showNotice('All catalog data reset to default demo collection.');
    }
  };

  // --- PRODUCT MANAGEMENT ---
  const handleAddNewProduct = () => {
    const newProd: Product = {
      id: `moonlit-${Date.now()}`,
      name: 'New Moonlit Jewelry Piece',
      handle: `moonlit-piece-${Date.now()}`,
      category: 'Rings',
      price: 2999,
      originalPrice: 3499,
      currency: 'PKR',
      image: 'https://cdn.shopify.com/s/files/1/0772/0288/2607/files/SilverTonering1.png?v=1787589399',
      galleryImages: [
        'https://cdn.shopify.com/s/files/1/0772/0288/2607/files/SilverTonering1.png?v=1787589399'
      ],
      shortDescription: 'Handcrafted luxury jewelry piece made with precious metals and fine details.',
      description: '<p>Exquisite fine jewelry piece handcrafted with exceptional precision and attention to detail.</p>',
      badge: 'New Arrival',
      availability: 'in_stock',
      featured: false,
      isNew: true,
      material: '925 Sterling Silver / Rhodium Tone',
      gemstone: 'Fine Cut Brilliant Accents',
      tags: ['handcrafted', 'luxury jewelry', 'rings'],
      visible: true,
      careInstructions: 'Store in Moonlit velvet pouch. Avoid direct perfumes.'
    };
    setEditingProduct(newProd);
    setIsAddingNew(true);
  };

  const handleDuplicateProduct = (prod: Product) => {
    const duplicated: Product = {
      ...prod,
      id: `moonlit-${Date.now()}`,
      name: `${prod.name} (Copy)`,
      handle: `${prod.handle}-copy-${Date.now()}`
    };
    setProducts([duplicated, ...products]);
    showNotice(`Duplicated "${prod.name}".`);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setProducts(products.filter((p) => p.id !== id));
      showNotice(`Deleted "${name}".`);
    }
  };

  const handleToggleVisibility = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p))
    );
  };

  const handleSaveProductModal = (prod: Product) => {
    if (isAddingNew) {
      setProducts([prod, ...products]);
      showNotice(`Added product "${prod.name}".`);
    } else {
      setProducts(products.map((p) => (p.id === prod.id ? prod : p)));
      showNotice(`Updated product "${prod.name}".`);
    }
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  // Image file upload helper (converts to base64)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        callback(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered products list for table
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#5C4D40]/30 backdrop-blur-md backdrop-blur-xs flex flex-col">
      {/* Top Header */}
      <div className="bg-[#F5EACB] text-[#5A4112] border-b border-[#EADBBD] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#88641C] flex items-center justify-center font-serif font-bold text-white text-sm">
            M
          </div>
          <div>
            <h2 className="font-serif text-lg font-medium leading-none">
              Moonlit Jewelry Atelier Admin
            </h2>
            <p className="text-[10px] text-stone-400 font-sans tracking-widest uppercase mt-1">
              Storefront & Catalog Management Console
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          {notification && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-sans animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{notification}</span>
            </div>
          )}

          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-[#7E5C1E] hover:bg-[#684A14] text-[#FAF6EE] font-sans font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>

          <button
            onClick={handleResetToDefaults}
            className="px-3 py-2 bg-[#FAF6EE] hover:bg-[#EBDCB4] text-[#5A4112] border border-[#DECFA9] font-sans text-xs tracking-wider uppercase flex items-center gap-1 transition-colors cursor-pointer font-bold"
            title="Reset to default demo products and settings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            onClick={() => {
              authService.logout();
              onLogout();
            }}
            className="px-3 py-2 bg-[#FAF6EE] hover:bg-red-50 hover:text-red-700 text-[#7E6649] border border-[#DECFA9] font-sans text-xs tracking-wider uppercase flex items-center gap-1 transition-colors cursor-pointer font-bold"
            title="Log out of admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Logout</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white transition-colors"
            aria-label="Close Admin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="bg-[#EDE1BD] text-[#7E5C1E] border-b border-[#DECFA9] px-6 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'products', label: 'Products Catalog', icon: List, count: products.length },
          { id: 'images', label: 'Image Management', icon: ImageIcon },
          { id: 'text', label: 'Website Content & Branding', icon: Type },
          { id: 'pricing', label: 'Currency & Pricing', icon: DollarSign },
          { id: 'inquiries', label: 'Customer Inquiries', icon: MessageSquare, count: inquiries.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-sans uppercase tracking-[0.14em] font-medium border-b-2 transition-all whitespace-nowrap ${
                active
                  ? 'border-[#B8913D] text-white bg-stone-800/50'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="w-4 h-4 text-[#C29B38]" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-700 text-stone-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF9F5] text-[#44331C]">
        {/* ============================================================ */}
        {/* TAB 1: PRODUCTS CATALOG */}
        {/* ============================================================ */}
        {activeTab === 'products' && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 border border-stone-200">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[240px]">
                  <input
                    type="text"
                    placeholder="Search by name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-1.5 pl-8 text-xs font-sans focus:outline-none focus:border-[#7E5C1E]"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Category filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#FAF8F5] border border-stone-300 px-3 py-1.5 text-xs font-sans focus:outline-none focus:border-[#7E5C1E]"
                >
                  <option value="all">All Categories</option>
                  <option value="rings">Rings</option>
                  <option value="earrings">Earrings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="bridal jewelry">Bridal Jewelry</option>
                </select>
              </div>

              <button
                onClick={handleAddNewProduct}
                className="px-4 py-2 bg-[#7E5C1E] text-[#FAF6EE] hover:bg-[#684A14] text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#C29B38]" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Product Table */}
            <div className="bg-white border border-stone-200 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                    <th className="p-3 w-14">Image</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Material & Details</th>
                    <th className="p-3">Availability</th>
                    <th className="p-3 text-center">Featured</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-cover bg-stone-100 border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                      </td>
                      <td className="p-3 max-w-[260px]">
                        <p className="font-serif font-medium text-[#44331C] text-sm truncate">
                          {p.name}
                        </p>
                        <span className="text-[10px] text-stone-400 font-mono">
                          ID: {p.id}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[11px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 tabular-nums font-semibold text-[#44331C]">
                        {p.currency} {p.price.toLocaleString()}
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="block text-[10px] text-stone-400 line-through">
                            {p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-stone-600 max-w-[200px]">
                        <p className="truncate">{p.material}</p>
                        <p className="text-[10px] text-stone-400 truncate">{p.gemstone}</p>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] uppercase font-semibold px-2 py-0.5 ${
                            p.availability === 'in_stock'
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-amber-700 bg-amber-50'
                          }`}
                        >
                          {p.availability.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {p.featured ? (
                          <Sparkles className="w-4 h-4 text-[#88641C] mx-auto" />
                        ) : (
                          <span className="text-stone-300">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleVisibility(p.id)}
                          className="p-1 hover:bg-stone-200 rounded"
                          title={p.visible ? 'Hide from store' : 'Show on store'}
                        >
                          {p.visible ? (
                            <Eye className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-stone-400" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsAddingNew(false);
                            }}
                            className="p-1 text-stone-600 hover:text-[#44331C] hover:bg-stone-200 rounded"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(p)}
                            className="p-1 text-stone-600 hover:text-[#44331C] hover:bg-stone-200 rounded"
                            title="Duplicate product"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: IMAGE MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'images' && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-6 border border-stone-200">
              <h3 className="font-serif text-xl font-medium text-[#44331C] mb-2">
                Brand Logo & Storefront Visual Assets
              </h3>
              <p className="text-xs text-stone-500 font-sans mb-6">
                Upload or replace the Moonlit Jewelry logo emblem, hero background, and craftsmanship showcase banners.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Brand Logo Replacement */}
                <div className="p-4 border border-stone-200 bg-[#FAF9F5] flex flex-col justify-between">
                  <div>
                    <h4 className="font-sans font-semibold text-xs tracking-wider uppercase text-stone-800 mb-2">
                      Brand Logo Emblem
                    </h4>
                    <p className="text-[11px] text-stone-500 mb-4">
                      {content.logoUrl ? 'Using custom uploaded logo image.' : 'Using uploaded Moonlit vector emblem.'}
                    </p>
                    <div className="w-24 h-24 mx-auto mb-4 bg-white border border-stone-300 flex items-center justify-center p-2">
                      {content.logoUrl ? (
                        <img src={content.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-stone-400 text-center uppercase tracking-widest">
                          Original Vector Logo
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block w-full py-2 bg-[#7E5C1E] text-[#FAF6EE] text-center text-xs uppercase tracking-wider font-bold cursor-pointer hover:bg-[#684A14] shadow-xs">
                      <span>Upload Logo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileUpload(e, (url) => setContent({ ...content, logoUrl: url }))
                        }
                      />
                    </label>
                    {content.logoUrl && (
                      <button
                        onClick={() => setContent({ ...content, logoUrl: '' })}
                        className="w-full py-1 text-xs text-red-600 hover:underline"
                      >
                        Reset to Vector Logo
                      </button>
                    )}
                  </div>
                </div>

                {/* Hero Banner Image */}
                <div className="p-4 border border-stone-200 bg-[#FAF9F5] flex flex-col justify-between">
                  <div>
                    <h4 className="font-sans font-semibold text-xs tracking-wider uppercase text-stone-800 mb-2">
                      Hero Banner Image
                    </h4>
                    <div className="aspect-video w-full mb-4 bg-stone-200 overflow-hidden border border-stone-300">
                      <img
                        src={content.heroImage}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  <label className="block w-full py-2 bg-[#7E5C1E] text-[#FAF6EE] text-center text-xs uppercase tracking-wider font-bold cursor-pointer hover:bg-[#684A14] shadow-xs">
                    <span>Upload New Hero Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileUpload(e, (url) => setContent({ ...content, heroImage: url }))
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Quick Product Image Selector */}
            <div className="bg-white p-6 border border-stone-200">
              <h3 className="font-serif text-xl font-medium text-[#44331C] mb-2">
                Product Image Catalog
              </h3>
              <p className="text-xs text-stone-500 font-sans mb-4">
                Click any product to manage its main photo or add/reorder gallery images.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {products.slice(0, 18).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setEditingProduct(p);
                      setIsAddingNew(false);
                    }}
                    className="p-2 border border-stone-200 hover:border-[#7E5C1E] transition-colors cursor-pointer group bg-[#FAF8F5]"
                  >
                    <div className="aspect-square bg-white overflow-hidden mb-1.5 border border-stone-200">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="font-serif text-xs font-medium text-[#44331C] truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {p.galleryImages?.length || 1} Images
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: TEXT MANAGEMENT & BRANDING */}
        {/* ============================================================ */}
        {activeTab === 'text' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 border border-stone-200 space-y-6">
              <h3 className="font-serif text-xl font-medium text-[#44331C] border-b border-stone-100 pb-3">
                Brand Identity & Copy
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={content.companyName}
                    onChange={(e) => setContent({ ...content, companyName: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    Brand Slogan
                  </label>
                  <input
                    type="text"
                    value={content.slogan}
                    onChange={(e) => setContent({ ...content, slogan: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={content.heroHeading}
                  onChange={(e) => setContent({ ...content, heroHeading: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                  Hero Supporting Description
                </label>
                <textarea
                  rows={3}
                  value={content.heroSubheading}
                  onChange={(e) => setContent({ ...content, heroSubheading: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={content.heroCtaPrimary}
                    onChange={(e) => setContent({ ...content, heroCtaPrimary: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={content.heroCtaSecondary}
                    onChange={(e) => setContent({ ...content, heroCtaSecondary: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Footer Information */}
            <div className="bg-white p-6 border border-stone-200 space-y-6">
              <h3 className="font-serif text-xl font-medium text-[#44331C] border-b border-stone-100 pb-3">
                Official Contact & Footer Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={content.phone}
                    onChange={(e) => setContent({ ...content, phone: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={content.whatsapp}
                    onChange={(e) => setContent({ ...content, whatsapp: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    Atelier Email
                  </label>
                  <input
                    type="email"
                    value={content.email}
                    onChange={(e) => setContent({ ...content, email: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={content.instagram}
                    onChange={(e) => setContent({ ...content, instagram: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                  Atelier Address
                </label>
                <input
                  type="text"
                  value={content.address}
                  onChange={(e) => setContent({ ...content, address: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                  Footer Narrative
                </label>
                <textarea
                  rows={3}
                  value={content.footerText}
                  onChange={(e) => setContent({ ...content, footerText: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                />
              </div>

              {/* SEO Meta */}
              <div className="pt-4 border-t border-stone-100 space-y-4">
                <h4 className="font-serif text-base font-medium text-[#44331C]">
                  Search Engine Optimization (SEO)
                </h4>
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={content.seoTitle}
                    onChange={(e) => setContent({ ...content, seoTitle: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={content.seoDescription}
                    onChange={(e) => setContent({ ...content, seoDescription: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PRICING & CURRENCY */}
        {/* ============================================================ */}
        {activeTab === 'pricing' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 border border-stone-200 space-y-6">
              <h3 className="font-serif text-xl font-medium text-[#44331C] border-b border-stone-100 pb-3">
                Storefront Currency & Global Exchange Rates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    Default Display Currency
                  </label>
                  <select
                    value={content.currency}
                    onChange={(e) => setContent({ ...content, currency: e.target.value as any })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans"
                  >
                    <option value="PKR">Pakistani Rupee (PKR - Rs.)</option>
                    <option value="USD">United States Dollar (USD - $)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-stone-600 font-semibold mb-1">
                    Exchange Rate (1 USD = X PKR)
                  </label>
                  <input
                    type="number"
                    value={content.pkrToUsdRate}
                    onChange={(e) =>
                      setContent({ ...content, pkrToUsdRate: parseFloat(e.target.value) || 278 })
                    }
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-sans tabular-nums"
                  />
                </div>
              </div>

              {/* Bulk Price Adjustment tool */}
              <div className="pt-6 border-t border-stone-100">
                <h4 className="font-serif text-base font-medium text-[#44331C] mb-2">
                  Catalog Price Adjustment
                </h4>
                <p className="text-xs text-stone-500 font-sans mb-4">
                  Apply a global percentage increase or discount across all {products.length} products.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      if (window.confirm('Apply a 10% discount to all current prices?')) {
                        setProducts(
                          products.map((p) => ({
                            ...p,
                            originalPrice: p.price,
                            price: Math.round(p.price * 0.9)
                          }))
                        );
                        showNotice('Applied 10% discount to all products.');
                      }
                    }}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-sans uppercase tracking-wider"
                  >
                    Apply 10% Storewide Discount
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Apply a 5% inflation/price adjustment to all products?')) {
                        setProducts(
                          products.map((p) => ({
                            ...p,
                            price: Math.round(p.price * 1.05)
                          }))
                        );
                        showNotice('Adjusted prices +5%.');
                      }
                    }}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-sans uppercase tracking-wider"
                  >
                    Apply +5% Price Adjustment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: INQUIRIES */}
        {/* ============================================================ */}
        {activeTab === 'inquiries' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white p-6 border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#44331C]">
                    Customer Inquiries & Concierge Requests
                  </h3>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Requests submitted via “Ask About This Jewelry” and bespoke commission forms.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 rounded text-stone-700">
                  {inquiries.length} Requests
                </span>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400">
                  No inquiries received yet.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-base font-semibold text-[#44331C]">
                            {inq.fullName}
                          </span>
                          <span className="text-xs text-stone-400">({inq.date})</span>
                          <span
                            className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                              inq.status === 'new'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const nextStatus = inq.status === 'new' ? 'contacted' : 'completed';
                              storage.updateInquiryStatus(inq.id, nextStatus);
                              setInquiries(storage.getInquiries());
                              showNotice(`Marked inquiry as ${nextStatus}.`);
                            }}
                            className="px-2.5 py-1 border border-stone-200 hover:bg-stone-50 text-[11px] font-sans"
                          >
                            Mark {inq.status === 'new' ? 'Contacted' : 'Completed'}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-stone-600 font-sans">
                        <span>Email: {inq.email}</span>
                        {inq.phone && <span>Phone: {inq.phone}</span>}
                        {inq.productName && (
                          <span className="font-medium text-[#44331C]">
                            Piece: {inq.productName} (Code: {inq.productId})
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-700 bg-[#FAF8F5] p-3 border border-stone-100 leading-relaxed font-sans">
                        "{inq.message}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* EDIT PRODUCT MODAL */}
      {/* ============================================================ */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-[#5C4D40]/30 backdrop-blur-md backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white border border-stone-200 shadow-2xl max-h-[92vh] flex flex-col my-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F5EACB] text-[#5A4112]">
              <h3 className="font-serif text-lg font-medium">
                {isAddingNew ? 'Add New Jewelry Piece' : `Edit: ${editingProduct.name}`}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block tracking-wider uppercase font-semibold text-stone-600 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block tracking-wider uppercase font-semibold text-stone-600 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs"
                  >
                    <option value="Rings">Rings</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Bridal Jewelry">Bridal Jewelry</option>
                  </select>
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block tracking-wider uppercase font-semibold text-stone-600 mb-1">
                    Price ({editingProduct.currency}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs tabular-nums"
                  />
                </div>

                <div>
                  <label className="block tracking-wider uppercase font-semibold text-stone-600 mb-1">
                    Original Price (for Sale badge)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value ? parseFloat(e.target.value) : null
                      })
                    }
                    placeholder="e.g. 3499"
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs tabular-nums"
                  />
                </div>

                <div>
                  <label className="block tracking-wider uppercase font-semibold text-stone-600 mb-1">
                    Availability
                  </label>
                  <select
                    value={editingProduct.availability}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        availability: e.target.value as any
                      })
                    }
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs"
                  >
                    <option value="in_stock">In Stock (Ready to Ship)</option>
                    <option value="made_to_order">Made to Order / Bespoke</option>
                    <option value="low_stock">Limited Pieces</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Material & Stone Accent Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block tracking-wider uppercase font-semibold text-stone-600 mb-1">
                    Precious Material
                  </label>
                  <input
                    type="text"
                    value={editingProduct.material}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, material: e.target.value })
                    }
                    placeholder="e.g. 925 Sterling Silver / Rhodium Tone"
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block tracking-wider uppercase font-semibold text-stone-600 mb-1">
                    Stone & Accent Details
                  </label>
                  <input
                    type="text"
                    value={editingProduct.gemstone}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, gemstone: e.target.value })
                    }
                    placeholder="e.g. Brilliant Cut Crystals & Pavé Accents"
                    className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Images Section */}
              <div className="p-4 bg-[#FAF8F5] border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-semibold text-[#44331C]">
                    Product Images ({editingProduct.galleryImages?.length || 1})
                  </h4>
                  <label className="px-3 py-1 bg-[#7E5C1E] text-[#FAF6EE] text-[11px] uppercase tracking-wider font-bold cursor-pointer hover:bg-[#684A14] flex items-center gap-1 shadow-xs">
                    <Upload className="w-3 h-3" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileUpload(e, (url) => {
                          const current = editingProduct.galleryImages || [editingProduct.image];
                          setEditingProduct({
                            ...editingProduct,
                            image: current.length === 0 ? url : editingProduct.image,
                            galleryImages: [...current, url]
                          });
                        })
                      }
                    />
                  </label>
                </div>

                {/* Main image URL input */}
                <div>
                  <label className="block tracking-wider uppercase text-[10px] text-stone-500 mb-1">
                    Main Display Image URL
                  </label>
                  <input
                    type="text"
                    value={editingProduct.image}
                    onChange={(e) => {
                      const newUrl = e.target.value;
                      const gal = [...(editingProduct.galleryImages || [])];
                      gal[0] = newUrl;
                      setEditingProduct({
                        ...editingProduct,
                        image: newUrl,
                        galleryImages: gal
                      });
                    }}
                    className="w-full bg-white border border-stone-300 px-3 py-1.5 text-xs font-mono"
                  />
                </div>

                {/* Thumbnails Gallery Management */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                  {(editingProduct.galleryImages || [editingProduct.image]).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative border border-stone-300 bg-white p-1 group flex flex-col items-center"
                    >
                      <img
                        src={img}
                        alt={`Photo ${idx + 1}`}
                        className="w-full aspect-square object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex items-center justify-between w-full mt-1 px-1">
                        <span className="text-[10px] text-stone-400 font-mono">
                          #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          {idx > 0 && (
                            <button
                              onClick={() => {
                                const list = [...editingProduct.galleryImages];
                                const temp = list[idx - 1];
                                list[idx - 1] = list[idx];
                                list[idx] = temp;
                                setEditingProduct({
                                  ...editingProduct,
                                  image: list[0],
                                  galleryImages: list
                                });
                              }}
                              className="text-stone-500 hover:text-[#44331C]"
                              title="Move left"
                            >
                              <ArrowUp className="w-3 h-3 rotate-[-90deg]" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              const list = editingProduct.galleryImages.filter((_, i) => i !== idx);
                              setEditingProduct({
                                ...editingProduct,
                                image: list[0] || '',
                                galleryImages: list
                              });
                            }}
                            className="text-red-500 hover:text-red-700"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Short & Long Description */}
              <div>
                <label className="block tracking-wider uppercase font-semibold text-stone-600 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                  }
                  className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block tracking-wider uppercase font-semibold text-stone-600 mb-1">
                  Full Description & Specifications (HTML or Text)
                </label>
                <textarea
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full bg-[#FAF9F5] border border-stone-300 px-3 py-2 text-xs font-mono"
                />
              </div>

              {/* Feature Flags */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#88641C]"
                  />
                  <span className="font-semibold text-stone-800">Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNew}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isNew: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#88641C]"
                  />
                  <span className="font-semibold text-stone-800">Mark as New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.visible}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, visible: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#88641C]"
                  />
                  <span className="font-semibold text-stone-800">Visible on Storefront</span>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-stone-200 bg-[#FAF9F5] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-sans uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveProductModal(editingProduct)}
                className="px-6 py-2 bg-[#7E5C1E] text-[#FAF6EE] hover:bg-[#684A14] hover:text-white text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-[#C29B38]" />
                <span>Apply to Catalog</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
