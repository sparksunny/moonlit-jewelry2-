import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  Sparkles,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Clock
} from 'lucide-react';
import { Product, SiteContent } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onInquire: (product: Product) => void;
  currency: 'PKR' | 'USD';
  pkrToUsdRate: number;
  content: SiteContent;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onInquire,
  currency,
  pkrToUsdRate,
  content
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setSelectedImageIndex(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image];

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

  const whatsappMessage = encodeURIComponent(
    `Hello Moonlit Jewelry, I am interested in inquiring about "${product.name}" (Ref: ${product.id}). Is this piece available for immediate purchase or custom order?`
  );

  const cleanWhatsappNumber = content.whatsapp.replace(/[^0-9]/g, '');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#5C4D40]/30 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FDFCF9] border border-[#EADBBD] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button in warm cream */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EADBBD] bg-[#FAF6EE]">
          <div className="flex items-center gap-2 text-xs font-sans tracking-[0.18em] uppercase text-[#7E5C1E] font-bold">
            <span>{content.brandName}</span>
            <span>·</span>
            <span>{product.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-[#7E5C1E] hover:text-[#44331C] transition-colors text-xs flex items-center gap-1 cursor-pointer font-bold"
              title="Share piece"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline font-sans uppercase tracking-wider text-[11px]">
                {copiedLink ? 'Link Copied!' : 'Share'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#7E5C1E] hover:text-[#44331C] hover:bg-[#EBDCB4] rounded transition-colors cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery Column */}
            <div className="flex flex-col gap-4">
              {/* Main Image Display (SAVE and BEST SELLER options removed from image) */}
              <div className="relative aspect-square w-full bg-[#F7F4EB] overflow-hidden border border-[#DECFA9]">
                <img
                  src={images[selectedImageIndex] || product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 shrink-0 border-2 overflow-hidden bg-[#FAF6EE] transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-[#88641C] shadow-xs'
                          : 'border-[#DECFA9] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Guarantee markers */}
              <div className="pt-4 border-t border-[#EADBBD] grid grid-cols-2 gap-3 text-xs text-[#7E6649] font-sans">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#88641C]" />
                  <span className="font-semibold text-[#5A4112]">100% Certified Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#88641C]" />
                  <span className="font-semibold text-[#5A4112]">Handcrafted Quality</span>
                </div>
              </div>
            </div>

            {/* Product Purchase & Spec Column */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Availability status */}
                <div className="flex items-center gap-2 text-xs font-sans font-bold text-emerald-800 uppercase tracking-widest mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {product.availability === 'in_stock'
                      ? 'In Stock · Ready for Delivery'
                      : product.availability === 'made_to_order'
                      ? 'Bespoke · Made to Order'
                      : 'Limited Pieces Available'}
                  </span>
                </div>

                {/* Product Title */}
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#44331C] leading-tight mb-3">
                  {product.name}
                </h2>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-6 pb-4 border-b border-[#EADBBD] tabular-nums">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#44331C]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-[#A89679] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Action Buttons: Inquiry + WhatsApp in warm golden styling */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <button
                    onClick={() => {
                      onClose();
                      onInquire(product);
                    }}
                    className="flex-1 py-3.5 bg-[#7E5C1E] text-[#FAF6EE] hover:bg-[#684A14] transition-all text-xs font-sans font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#F5EACB]" />
                    <span>Ask About This Jewelry</span>
                  </button>

                  <a
                    href={`https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-5 bg-[#25D366] hover:bg-[#20BA5A] text-white transition-colors text-xs font-sans font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Specifications List */}
                <div className="space-y-4 mb-6 text-xs sm:text-sm font-sans">
                  <h4 className="font-serif text-base font-semibold text-[#44331C] border-b border-[#EADBBD] pb-1">
                    Jewelry Specifications
                  </h4>

                  <div className="grid grid-cols-2 gap-y-2 text-[#6B5536]">
                    <span className="text-[#886F4E] uppercase text-[11px] tracking-wider font-semibold">Precious Metal:</span>
                    <span className="font-bold text-[#44331C]">{product.material}</span>

                    <span className="text-[#886F4E] uppercase text-[11px] tracking-wider font-semibold">Category:</span>
                    <span className="font-bold text-[#44331C]">{product.category}</span>

                    <span className="text-[#886F4E] uppercase text-[11px] tracking-wider font-semibold">Item Code:</span>
                    <span className="font-mono text-[#7E5C1E] text-[12px] font-semibold">{product.id}</span>
                  </div>
                </div>

                {/* Description Text */}
                <div className="mb-6">
                  <h4 className="font-serif text-base font-semibold text-[#44331C] border-b border-[#EADBBD] pb-1 mb-2">
                    Description
                  </h4>
                  <div
                    className="text-xs sm:text-sm text-[#6B5536] leading-relaxed font-sans prose prose-stone max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description || product.shortDescription }}
                  />
                </div>

                {/* Care Information */}
                {product.careInstructions && (
                  <div className="p-3.5 bg-[#FAF6EE] border border-[#DECFA9] text-xs text-[#6B5536] font-sans">
                    <span className="font-bold text-[#44331C] uppercase tracking-wider block mb-1">
                      Jewelry Care Guide
                    </span>
                    <p>{product.careInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
