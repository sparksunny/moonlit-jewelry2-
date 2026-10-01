import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Search,
  X
} from 'lucide-react';
import { Product, SortOption } from '../types';
import { ProductCard } from './ProductCard';

interface CollectionGridProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  currency: 'PKR' | 'USD';
  pkrToUsdRate: number;
  onSelectProduct: (product: Product) => void;
  onInquireProduct: (product: Product) => void;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  currency,
  pkrToUsdRate,
  onSelectProduct,
  onInquireProduct
}) => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);

  // Derived filter options
  const materials = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.material) set.add(p.material);
    });
    return Array.from(set);
  }, [products]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.visible);

    // Category filter
    if (selectedCategory !== 'All Jewelry') {
      result = result.filter(
        (p) =>
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }

    // Material filter
    if (selectedMaterial !== 'all') {
      result = result.filter((p) => p.material === selectedMaterial);
    }

    // Availability filter
    if (selectedAvailability !== 'all') {
      result = result.filter((p) => p.availability === selectedAvailability);
    }

    // Price range
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'title-asc':
          return a.name.localeCompare(b.name);
        case 'title-desc':
          return b.name.localeCompare(a.name);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [
    products,
    selectedCategory,
    selectedMaterial,
    selectedAvailability,
    priceRange,
    searchQuery,
    sortBy
  ]);

  const hasActiveFilters =
    selectedCategory !== 'All Jewelry' ||
    selectedMaterial !== 'all' ||
    selectedAvailability !== 'all' ||
    searchQuery.trim() !== '' ||
    priceRange[0] > 0 ||
    priceRange[1] < 15000;

  const resetFilters = () => {
    onSelectCategory('All Jewelry');
    setSelectedMaterial('all');
    setSelectedAvailability('all');
    setSearchQuery('');
    setPriceRange([0, 15000]);
    setSortBy('featured');
  };

  const categoriesList = [
    'All Jewelry',
    'Rings',
    'Earrings',
    'Necklaces',
    'Bracelets',
    'Bridal Jewelry'
  ];

  return (
    <section id="collection-grid" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title & Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#EADBBD] pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-sans text-[#7E6649] mb-2 font-semibold">
            <span>Catalogue</span>
            <span>/</span>
            <span className="text-[#88641C] font-bold">{selectedCategory}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#44331C] tracking-tight">
            {selectedCategory === 'All Jewelry' ? 'Complete Collection' : selectedCategory}
          </h2>
        </div>

        {/* Count & Quick Actions */}
        <div className="flex items-center gap-4 text-xs font-sans tracking-wide text-[#7E6649]">
          <span className="tabular-nums font-bold text-[#44331C]">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'} Available
          </span>
          <span className="text-[#D4C49E]">|</span>
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#DECFA9] hover:border-[#7E5C1E] text-[#5A4112] bg-[#FAF6EE] transition-colors uppercase font-bold tracking-wider text-[11px] cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#88641C]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#88641C]" />
            )}
          </button>
        </div>
      </div>

      {/* Filter & Sorting Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#FAF6EE] p-3 sm:p-4 border border-[#EADBBD]">
        {/* Category Quick Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
          {categoriesList.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 text-xs font-sans tracking-[0.12em] uppercase whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-[#7E5C1E] text-[#FAF6EE] font-bold shadow-xs'
                    : 'bg-[#FDFCF9] hover:bg-[#EBDCB4] text-[#5A4112] border border-[#DECFA9] font-semibold'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <label htmlFor="sort-select" className="text-xs font-sans tracking-wider uppercase text-[#7E6649] font-semibold hidden sm:inline">
            Sort:
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-[#FDFCF9] border border-[#DECFA9] px-3 py-1.5 pr-8 text-xs font-sans text-[#5A4112] font-semibold focus:outline-none focus:border-[#7E5C1E] cursor-pointer"
            >
              <option value="featured">Featured Pieces</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Alphabetical: A–Z</option>
              <option value="title-desc">Alphabetical: Z–A</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#88641C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Expandable Filter Drawer / Panel */}
      {filterDrawerOpen && (
        <div className="mb-8 p-6 bg-[#FDFCF9] border border-[#EADBBD] shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between border-b border-[#EADBBD] pb-4 mb-6">
            <h3 className="font-serif text-lg font-bold text-[#44331C] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#88641C]" />
              <span>Refine Collection</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#88641C] hover:text-[#44331C] font-bold tracking-wider uppercase flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-sans tracking-[0.16em] uppercase text-[#7E6649] font-bold mb-2">
                Keyword Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Halo, Silver, Gold, Ring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#DECFA9] px-3 py-2 pl-9 text-xs font-sans text-[#44331C] font-medium focus:outline-none focus:border-[#7E5C1E]"
                />
                <Search className="w-4 h-4 text-[#88641C] absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#88641C] hover:text-[#44331C] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-sans tracking-[0.16em] uppercase text-[#7E6649] font-bold mb-2">
                Availability
              </label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full bg-[#FAF6EE] border border-[#DECFA9] px-3 py-2 text-xs font-sans text-[#44331C] font-medium focus:outline-none focus:border-[#7E5C1E] cursor-pointer"
              >
                <option value="all">All Items</option>
                <option value="in_stock">In Stock (Ready to Ship)</option>
                <option value="made_to_order">Made to Order / Bespoke</option>
                <option value="low_stock">Limited Pieces</option>
              </select>
            </div>

            {/* Material */}
            <div>
              <label className="block text-xs font-sans tracking-[0.16em] uppercase text-[#7E6649] font-bold mb-2">
                Precious Material
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full bg-[#FAF6EE] border border-[#DECFA9] px-3 py-2 text-xs font-sans text-[#44331C] font-medium focus:outline-none focus:border-[#7E5C1E] cursor-pointer"
              >
                <option value="all">All Materials</option>
                {materials.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-[#6B5536] font-sans">
          <span className="text-[11px] tracking-wider uppercase text-[#886F4E] font-bold">Active filters:</span>
          {selectedCategory !== 'All Jewelry' && (
            <button
              onClick={() => onSelectCategory('All Jewelry')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF6EE] hover:bg-[#EBDCB4] text-[#5A4112] border border-[#DECFA9] rounded-none text-xs font-semibold cursor-pointer"
            >
              <span>{selectedCategory}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {selectedMaterial !== 'all' && (
            <button
              onClick={() => setSelectedMaterial('all')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF6EE] hover:bg-[#EBDCB4] text-[#5A4112] border border-[#DECFA9] rounded-none text-xs font-semibold cursor-pointer"
            >
              <span>{selectedMaterial}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF6EE] hover:bg-[#EBDCB4] text-[#5A4112] border border-[#DECFA9] rounded-none text-xs font-semibold cursor-pointer"
            >
              <span>Search: "{searchQuery}"</span>
              <X className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={resetFilters}
            className="text-[#88641C] hover:underline text-xs ml-2 font-bold cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              pkrToUsdRate={pkrToUsdRate}
              onSelect={onSelectProduct}
              onInquire={onInquireProduct}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-[#FAF6EE] border border-[#DECFA9] p-8">
          <Sparkles className="w-8 h-8 text-[#C2AB72] mx-auto mb-3" />
          <h3 className="font-serif text-2xl text-[#44331C] font-medium mb-2">
            No Jewelry Matches Your Selection
          </h3>
          <p className="text-sm text-[#7E6649] max-w-md mx-auto mb-6">
            We could not find any jewelry matching your chosen criteria. Try adjusting your filters or search keywords.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-[#7E5C1E] text-[#FAF6EE] text-xs font-sans uppercase font-bold tracking-[0.16em] hover:bg-[#684A14] transition-colors cursor-pointer shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
