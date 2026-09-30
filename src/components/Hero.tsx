import React from 'react';
import { ArrowDown, Sparkles, Gem, ShieldCheck, Clock } from 'lucide-react';
import { SiteContent } from '../types';

interface HeroProps {
  content: SiteContent;
  onExplore: () => void;
  onContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  content,
  onExplore,
  onContact
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF6EE] text-[#44331C] border-b border-[#EBDCB4]">
      {/* Background imagery with soft luminous warm cream overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.heroImage}
          alt="Moonlit Jewelry Heritage Collection"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6EE] via-[#FAF6EE]/90 to-[#FAF6EE]/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#FAF6EE]/20 to-[#FAF6EE]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 flex flex-col items-start justify-center">
        {/* Editorial Subtitle in refined warm gold */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm tracking-[0.26em] uppercase text-[#9E772B] font-sans font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#88641C]" />
          <span>Haute Joaillerie & Timeless Elegance</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#44331C] max-w-3xl leading-[1.12] mb-6 text-balance">
          {content.heroHeading}
        </h1>

        {/* Supporting description */}
        <p className="text-base sm:text-lg text-[#6B5536] font-sans font-normal max-w-2xl leading-relaxed mb-10 text-pretty">
          {content.heroSubheading}
        </p>

        {/* Call to actions in warm golden tones */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <button
            onClick={onExplore}
            className="px-8 py-3.5 bg-[#7E5C1E] hover:bg-[#684A14] text-[#FAF6EE] font-sans font-bold text-xs sm:text-sm tracking-[0.18em] uppercase rounded-xs transition-all duration-200 shadow-md hover:shadow-lg hover:translate-y-[-1px] flex items-center gap-2 cursor-pointer"
          >
            <span>{content.heroCtaPrimary}</span>
            <ArrowDown className="w-4 h-4 text-[#F5EACB]" />
          </button>

          <button
            onClick={onContact}
            className="px-8 py-3.5 bg-[#FAF6EE]/80 hover:bg-[#EBDCB4] text-[#7E5C1E] border border-[#C29B38] font-sans font-bold text-xs sm:text-sm tracking-[0.18em] uppercase rounded-xs transition-all duration-200 backdrop-blur-xs cursor-pointer shadow-xs"
          >
            {content.heroCtaSecondary}
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-[#E8DCC0] w-full grid grid-cols-2 sm:grid-cols-4 gap-6 text-[#5A4112] text-xs sm:text-sm font-sans">
          <div className="flex items-center gap-3">
            <Gem className="w-5 h-5 text-[#88641C] shrink-0" />
            <div>
              <p className="font-bold text-[#44331C] tracking-wide uppercase text-[11px]">100% Real Metals</p>
              <p className="text-[11px] text-[#7E6649] font-medium">925 Silver & Solid Gold</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#88641C] shrink-0" />
            <div>
              <p className="font-bold text-[#44331C] tracking-wide uppercase text-[11px]">Authentic Pedigree</p>
              <p className="text-[11px] text-[#7E6649] font-medium">Pure Precious Metals</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#88641C] shrink-0" />
            <div>
              <p className="font-bold text-[#44331C] tracking-wide uppercase text-[11px]">Bespoke Sizing</p>
              <p className="text-[11px] text-[#7E6649] font-medium">Custom Atelier Commissions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#88641C] shrink-0" />
            <div>
              <p className="font-bold text-[#44331C] tracking-wide uppercase text-[11px]">Personal Concierge</p>
              <p className="text-[11px] text-[#7E6649] font-medium">Direct WhatsApp Assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
