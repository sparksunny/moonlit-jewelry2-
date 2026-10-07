import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  Sparkles,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Product, SiteContent } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onInquire: (product: Product) => void;
  currency?: 'PKR' | 'USD';
  pkrToUsdRate?: number;
  content: SiteContent;
}

// Requirement 6: Back page description of each product: remove a) Key feature b) Product Detail
const cleanBackpageDescription = (rawHtml?: string, fallbackDesc?: string): string => {
  if (!rawHtml && !fallbackDesc) return '';
  let text = rawHtml || fallbackDesc || '';

  // 1. Remove sections with "Product Detail" or "Product Details" or "Key feature" or "Key features"
  text = text.replace(/<h[1-6][^>]*>[\s\S]*?(?:Product\s*Details?|Key\s*Features?)[\s\S]*?<\/h[1-6]>[\s\S]*?(?:<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>|<p[\s\S]*?<\/p>)?/gi, '');
  text = text.replace(/<(?:strong|b)[^>]*>[\s\S]*?(?:Product\s*Details?|Key\s*Features?)[\s\S]*?<\/(?:strong|b)>[\s\S]*?(?:<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>|<br\s*\/?>[\s\S]*?<\/p>)?/gi, '');
  text = text.replace(/(?:Product\s*Details?|Key\s*Features?):?[\s\S]*?(?:Brand|Style|Color|Stone|Setting|Ring Type|Band Finish|Marking|For|Occasions?)[\s\S]*?(?:<\/p>|$)/gi, '');
  text = text.replace(/<ul>[\s\S]*?<\/ul>/gi, '');
  text = text.replace(/<ol>[\s\S]*?<\/ol>/gi, '');

  // 2. Remove any lingering Item code mentions
  text = text.replace(/(?:Item\s*Code|ItemCode|Code):\s*[^\s<]+/gi, '');

  // 3. Strip empty paragraphs
  text = text.replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, '');
  text = text.trim();

  // If text became empty after removing Product Details / Key Features, fallback to refined narrative
  if (!text || text.replace(/<[^>]*>/g, '').trim().length < 5) {
    return `<p>An authentic handcrafted fine jewelry creation from Moonlit Jewelry, designed with exquisite precious metals and timeless elegance.</p>`;
  }

  return text;
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onInquire,
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

  const whatsappMessage = encodeURIComponent(
    `Hello Moonlit Jewelry, I am interested in inquiring about "${product.name}" (Article No: ${product.articleNo}). Is this piece available for immediate purchase or custom order?`
  );

  const cleanWhatsappNumber = content.whatsapp.replace(/[^0-9]/g, '');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const sanitizedDescription = cleanBackpageDescription(product.description, product.shortDescription);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FDFCF9] border-2 border-black shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button in pure Black typography */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black bg-[#FAF6EE]">
          <div className="flex items-center gap-2 text-xs font-sans tracking-[0.18em] uppercase text-black font-bold">
            <span className="text-black font-bold">{content.brandName}</span>
            <span className="text-black font-bold">·</span>
            <span className="text-black font-bold">{product.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-black hover:bg-black/10 transition-colors text-xs flex items-center gap-1 cursor-pointer font-bold"
              title="Share piece"
            >
              <Share2 className="w-4 h-4 text-black" />
              <span className="hidden sm:inline font-sans uppercase tracking-wider text-[11px] text-black font-bold">
                {copiedLink ? 'Link Copied!' : 'Share'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-black hover:bg-black/10 rounded transition-colors cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery Column */}
            <div className="flex flex-col gap-4">
              {/* Main Image Display */}
              <div className="relative aspect-square w-full bg-[#F7F4EB] overflow-hidden border border-black">
                <img
                  src={images[selectedImageIndex] || product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {/* Article No badge at bottom of modal image */}
                <div className="absolute inset-x-0 bottom-0 py-1.5 px-3 bg-white/95 backdrop-blur-xs border-t border-black flex items-center justify-between text-black z-10">
                  <span className="text-[10px] tracking-wider uppercase font-bold text-black font-sans">
                    Article No
                  </span>
                  <span className="text-xs font-mono font-bold tracking-widest text-black">
                    {product.articleNo}
                  </span>
                </div>
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
                          ? 'border-black shadow-xs'
                          : 'border-stone-300 opacity-70 hover:opacity-100'
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

              {/* Guarantee markers in pure Black */}
              <div className="pt-4 border-t border-black/20 grid grid-cols-2 gap-3 text-xs text-black font-sans font-bold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                  <span className="font-bold text-black">100% Certified Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-black shrink-0" />
                  <span className="font-bold text-black">Handcrafted Quality</span>
                </div>
              </div>
            </div>

            {/* Product Purchase & Spec Column (All pure Black fonts, NO price) */}
            <div className="flex flex-col justify-between text-black">
              <div>
                {/* Availability status in pure Black */}
                <div className="flex items-center gap-2 text-xs font-sans font-bold text-black uppercase tracking-widest mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                  <span className="text-black font-bold">
                    {product.availability === 'in_stock'
                      ? 'In Stock · Ready for Delivery'
                      : product.availability === 'made_to_order'
                      ? 'Bespoke · Made to Order'
                      : 'Limited Pieces Available'}
                  </span>
                </div>

                {/* Product Title in pure Black */}
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black leading-tight mb-4">
                  {product.name}
                </h2>

                {/* Action Buttons: Inquiry + WhatsApp in high contrast black & white */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <button
                    onClick={() => {
                      onClose();
                      onInquire(product);
                    }}
                    className="flex-1 py-3.5 bg-black text-white hover:bg-stone-800 transition-all text-xs font-sans font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 shadow-xs cursor-pointer border border-black"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span className="text-white font-bold">Ask About This Piece</span>
                  </button>

                  <a
                    href={`https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-5 bg-white hover:bg-black text-black hover:text-white border-2 border-black transition-colors text-xs font-sans font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-current" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Jewelry Specifications in pure Black (NO item code, 5-digit Article No included) */}
                <div className="space-y-4 mb-6 text-xs sm:text-sm font-sans text-black">
                  <h4 className="font-serif text-base font-bold text-black border-b border-black pb-1">
                    Jewelry Information
                  </h4>

                  <div className="grid grid-cols-2 gap-y-2.5 text-black">
                    <span className="text-black uppercase text-[11px] tracking-wider font-bold">Article No:</span>
                    <span className="font-mono text-black text-sm font-bold tracking-widest">{product.articleNo}</span>

                    <span className="text-black uppercase text-[11px] tracking-wider font-bold">Precious Metal:</span>
                    <span className="font-bold text-black">{product.material}</span>

                    <span className="text-black uppercase text-[11px] tracking-wider font-bold">Category:</span>
                    <span className="font-bold text-black">{product.category}</span>

                    {product.gemstone && (
                      <>
                        <span className="text-black uppercase text-[11px] tracking-wider font-bold">Gemstone:</span>
                        <span className="font-bold text-black">{product.gemstone}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Sanitized Narrative Description (Key features & Product Details removed) */}
                <div className="mb-6 text-black">
                  <h4 className="font-serif text-base font-bold text-black border-b border-black pb-1 mb-2">
                    Description
                  </h4>
                  <div
                    className="text-xs sm:text-sm text-black font-sans leading-relaxed prose prose-stone max-w-none font-medium [&_*]:text-black"
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                </div>

                {/* Care Information in pure Black */}
                {product.careInstructions && (
                  <div className="p-3.5 bg-[#FAF6EE] border border-black text-xs text-black font-sans">
                    <span className="font-bold text-black uppercase tracking-wider block mb-1">
                      Jewelry Care Guide
                    </span>
                    <p className="text-black font-medium">{product.careInstructions}</p>
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
