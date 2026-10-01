import React, { useState } from 'react';
import { Eye, MessageSquare, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  currency: 'PKR' | 'USD';
  pkrToUsdRate: number;
  onSelect: (product: Product) => void;
  onInquire: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  pkrToUsdRate,
  onSelect,
  onInquire
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (val?: number | null) => {
    if (val === undefined || val === null) return null;
    if (currency === 'USD') {
      const usdVal = Math.round(val / pkrToUsdRate);
      return `$${usdVal.toLocaleString()}`;
    }
    return `Rs. ${val.toLocaleString()}`;
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const secondaryImage =
    product.galleryImages && product.galleryImages.length > 1
      ? product.galleryImages[1]
      : null;

  return (
    <div
      className="group relative flex flex-col bg-[#FDFCF9] border border-[#EADBBD] rounded-none overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#D4C49E]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div
        onClick={() => onSelect(product)}
        className="relative w-full aspect-square bg-[#F7F4EB] overflow-hidden cursor-pointer"
      >
        {/* Subtle Loading Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#EDE7D8] animate-pulse flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#C2AB72]" />
          </div>
        )}

        {/* Primary Product Image */}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transition-all duration-500 ease-out ${
            isHovered && secondaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />

        {/* Secondary Image on Hover */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Status tag in warm golden tones (SAVE and BEST SELLER options removed from images) */}
        {product.badge && !/^(best seller|save)/i.test(product.badge.trim()) && (
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            <span className="text-[10px] tracking-[0.16em] uppercase font-sans font-bold bg-[#FAF6EE]/95 backdrop-blur-xs text-[#5A4112] px-2 py-0.5 border border-[#DECFA9]">
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick View Button overlay on hover in warm golden-cream scrim */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#5A4112]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="w-full py-2 bg-[#FAF6EE] text-[#5A4112] hover:bg-[#7E5C1E] hover:text-[#FAF6EE] transition-colors text-[11px] font-sans font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-[#FDFCF9]">
        <div>
          {/* Category & Material Metadata */}
          <div className="flex items-center gap-1.5 text-[11px] font-sans tracking-[0.18em] uppercase text-[#886F4E] mb-1.5">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.material}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelect(product)}
            className="font-serif text-base sm:text-lg font-medium text-[#44331C] group-hover:text-[#88641C] transition-colors cursor-pointer line-clamp-2 leading-snug mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#6B5536] line-clamp-2 leading-relaxed mb-3">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-[#EADBBD] flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-base sm:text-lg font-serif font-bold text-[#44331C]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#A89679] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onInquire(product);
            }}
            className="p-1.5 text-[#7E5C1E] hover:text-[#5A4112] hover:bg-[#FAF6EE] transition-colors rounded cursor-pointer"
            title="Ask about this jewelry"
            aria-label={`Ask about ${product.name}`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
