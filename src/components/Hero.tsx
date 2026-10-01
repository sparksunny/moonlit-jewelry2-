import React from 'react';
import { Sparkles, Gem, ShieldCheck, Clock } from 'lucide-react';
import { SiteContent } from '../types';

interface HeroProps {
  content: SiteContent;
  onExplore?: () => void;
  onContact?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  content
}) => {
  const heroImageSrc =
    content.heroImage && content.heroImage.trim() !== ''
      ? content.heroImage
      : '/src/assets/images/emerald_ribbon_hero_1790880730555.jpg';

  return (
    <section className="relative overflow-hidden bg-[#173a1e] text-white border-b border-[#0f2814]">
      {/* Background imagery with rich emerald green curves */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageSrc}
          alt="Moonlit Jewelry Heritage Collection"
          className="w-full h-full object-cover object-center opacity-95 scale-100 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Luminous emerald-tinted contrast overlay guaranteeing crisp white bold text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/10 sm:via-[#13301a]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 flex flex-col items-start justify-center">
        {/* Editorial Subtitle in white bold text */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm tracking-[0.26em] uppercase text-white font-sans font-bold mb-4 bg-black/35 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/30 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#fdeca6]" />
          <span>Haute Joaillerie & Timeless Elegance</span>
        </div>

        {/* Main Headline - White Bold Text */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white max-w-3xl leading-[1.14] mb-6 text-balance drop-shadow-md">
          {content.heroHeading}
        </h1>

        {/* Supporting description - White Bold Text */}
        <p className="text-base sm:text-lg text-white font-sans font-bold max-w-2xl leading-relaxed text-pretty drop-shadow-sm">
          {content.heroSubheading}
        </p>

        {/* Trust Badges Bar - White Bold Text */}
        <div className="mt-14 sm:mt-18 pt-8 border-t border-white/25 w-full grid grid-cols-2 sm:grid-cols-4 gap-6 text-white text-xs sm:text-sm font-sans backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <Gem className="w-5 h-5 text-[#fdeca6] shrink-0" />
            <div>
              <p className="font-bold text-white tracking-wide uppercase text-[11px] drop-shadow-2xs">100% Real Metals</p>
              <p className="text-[11px] text-white/90 font-bold">925 Silver & Solid Gold</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#fdeca6] shrink-0" />
            <div>
              <p className="font-bold text-white tracking-wide uppercase text-[11px] drop-shadow-2xs">Authentic Pedigree</p>
              <p className="text-[11px] text-white/90 font-bold">Pure Precious Metals</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#fdeca6] shrink-0" />
            <div>
              <p className="font-bold text-white tracking-wide uppercase text-[11px] drop-shadow-2xs">Bespoke Sizing</p>
              <p className="text-[11px] text-white/90 font-bold">Custom Atelier Commissions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#fdeca6] shrink-0" />
            <div>
              <p className="font-bold text-white tracking-wide uppercase text-[11px] drop-shadow-2xs">Personal Concierge</p>
              <p className="text-[11px] text-white/90 font-bold">Direct WhatsApp Assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
