import React, { useState } from 'react';
import {
  Search,
  Lock,
  Menu,
  X,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { MoonlitLogo } from './MoonlitLogo';
import { SiteContent } from '../types';

// Crisp SVG WhatsApp Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
  </svg>
);

interface HeaderProps {
  content: SiteContent;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenAdmin: () => void;
  onOpenInquiry: (productId?: string) => void;
  onOpenSearch: () => void;
  inquiryCount?: number;
  currency: 'PKR' | 'USD';
  onToggleCurrency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  content,
  activeCategory,
  onSelectCategory,
  onOpenAdmin,
  onOpenInquiry,
  onOpenSearch,
  inquiryCount = 0,
  currency,
  onToggleCurrency
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    'Home',
    'All Jewelry',
    'Wedding Bands & Rings',
    'endants & Necklace',
    'Bridal Jewelry',
    'Bangles & Bracelets',
    'Earrings & Studs',
    'Pearl & Polki Jewelry'
  ];

  const handleNavClick = (item: string) => {
    onSelectCategory(item === 'Home' ? 'All Jewelry' : item);
    setMobileMenuOpen(false);
    window.scrollTo({ top: item === 'Home' ? 0 : 540, behavior: 'smooth' });
  };

  const whatsappPhone = content.whatsapp || content.phone || '+1 716-313-1615';
  const whatsappDigits = whatsappPhone.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 border-b border-[#ded3b6] shadow-xs transition-all">
      {/* Top Luxury Announcement Bar - remains the same (#fdeca6) */}
      <div className="bg-[#fdeca6] text-[#5A4112] text-[11px] tracking-[0.2em] uppercase py-2 px-4 border-b border-[#e5d89d] font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#88641C]" />
            <span className="font-sans">Real Jewelry · Precious Metals · Bespoke Craftsmanship</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center gap-4 text-[11px] font-sans">
            {/* WhatsApp Icon before Phone Number */}
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#5A4112] hover:text-[#2E2007] transition-colors group cursor-pointer bg-transparent"
              title="Chat with us on WhatsApp"
              aria-label={`WhatsApp: ${content.phone || '+1 716-313-1615'}`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#1E7E34] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-semibold tracking-normal">: {content.phone || '+1 716-313-1615'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Row - #f0ead3 soft antique cream with beautiful contrast */}
      <div className="bg-[#f0ead3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Left: Moonlit Logo - noticeably larger and easily visible */}
          <button
            onClick={() => handleNavClick('Home')}
            className="flex items-center text-left focus:outline-none group cursor-pointer bg-transparent py-0.5"
            aria-label="Moonlit Jewelry Home"
          >
            <MoonlitLogo customUrl={content.logoUrl} size="md" theme="gold" />
          </button>

          {/* Center: Brand Sub-tagline / Slogan on wide displays */}
          <div className="hidden lg:flex items-center text-center">
            <span className="font-serif italic text-sm text-[#6A4F18] tracking-widest">
              {content.slogan || 'Real Jewelry. Timeless Beauty.'}
            </span>
          </div>

          {/* Right Utility Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#4F3910] hover:text-[#1F1405] hover:bg-[#e6ddc1]/60 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent"
              aria-label="Search Collection"
              title="Search jewelry"
            >
              <Search className="w-4 h-4 text-[#88641C]" />
              <span className="hidden md:inline text-xs tracking-wider uppercase font-bold text-[#4F3910]">
                Search
              </span>
            </button>

            {/* Inquiry / Saved Items */}
            <button
              onClick={() => onOpenInquiry()}
              className="relative p-2 text-[#4F3910] hover:text-[#1F1405] hover:bg-[#e6ddc1]/60 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent"
              aria-label="Customer Inquiries"
              title="Inquire about jewelry pieces"
            >
              <MessageSquare className="w-4 h-4 text-[#88641C]" />
              <span className="hidden md:inline text-xs tracking-wider uppercase font-bold text-[#4F3910]">
                Inquire
              </span>
              {inquiryCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#88641C] text-[#FAF6EE] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {inquiryCount}
                </span>
              )}
            </button>

            {/* Dedicated ADMIN Button */}
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-1.5 text-xs font-sans font-bold tracking-[0.16em] uppercase bg-[#7E5C1E] text-[#FAF6EE] hover:bg-[#684a14] hover:text-white transition-all rounded-xs shadow-xs flex items-center gap-1.5 border border-[#684a14] cursor-pointer"
              aria-label="Administrator Access"
            >
              <Lock className="w-3 h-3 text-[#FAF6EE]" />
              <span>Admin</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4F3910] hover:bg-[#e6ddc1]/60 rounded-md transition-colors bg-transparent"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Category Bar in arranged sequence on #f0ead3 */}
      <nav className="hidden lg:block border-t border-[#ded3b6]/70 bg-[#f0ead3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center space-x-5 xl:space-x-7 py-2.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = (item === 'Home' && activeCategory === 'All Jewelry') || activeCategory === item;
              return (
                <li key={item} className="shrink-0">
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`text-[11px] xl:text-xs uppercase tracking-[0.13em] font-sans transition-all duration-200 py-1 relative cursor-pointer bg-transparent ${
                      isActive
                        ? 'text-[#2D1F08] font-bold'
                        : 'text-[#5A4112] hover:text-[#1F1405] font-semibold hover:opacity-95'
                    }`}
                  >
                    {item}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7E5C1E]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 bg-[#f0ead3] z-50 overflow-y-auto border-t border-[#ded3b6] p-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#7E5C1E] font-bold border-b border-[#ded3b6] pb-2">
              Browse Categories
            </div>
            <div className="grid grid-cols-1 gap-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`text-left py-2.5 px-3 text-sm font-sans tracking-[0.12em] uppercase transition-colors rounded ${
                    activeCategory === item || (item === 'Home' && activeCategory === 'All Jewelry')
                      ? 'bg-[#e5dbc0] text-[#2D1F08] font-bold'
                      : 'text-[#5A4112] hover:bg-[#e8dfc5]/50 font-semibold'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#ded3b6] space-y-3 text-xs text-[#5A4112] font-semibold">
            <div>
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#5A4112] hover:text-[#2E2007]"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#1E7E34] shrink-0" />
                <span>: {content.phone || '+1 716-313-1615'}</span>
              </a>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 bg-[#7E5C1E] text-[#FAF6EE] rounded text-center font-bold tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <Lock className="w-3 h-3 text-[#FAF6EE]" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
