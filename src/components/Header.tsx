import React, { useState } from 'react';
import {
  Search,
  Lock,
  Menu,
  X,
  MessageSquare,
  Sparkles,
  Phone
} from 'lucide-react';
import { MoonlitLogo } from './MoonlitLogo';
import { SiteContent } from '../types';

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
    'Rings',
    'Earrings',
    'Necklaces',
    'Bracelets',
    'Bridal Jewelry'
  ];

  const handleNavClick = (item: string) => {
    onSelectCategory(item === 'Home' ? 'All Jewelry' : item);
    setMobileMenuOpen(false);
    window.scrollTo({ top: item === 'Home' ? 0 : 540, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f5eacb] border-b border-[#dfcf9f] shadow-xs transition-all">
      {/* Top Luxury Announcement Bar with golden-colored typography on f5eacb tint */}
      <div className="bg-[#ede1bd] text-[#7E5C1E] text-[11px] tracking-[0.2em] uppercase py-2 px-4 border-b border-[#dfcf9f] font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#88641C]" />
            <span className="font-sans">Real Jewelry · Precious Metals · Bespoke Craftsmanship</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center gap-4 text-[11px] font-sans">
            <a
              href={`https://wa.me/${content.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#7E5C1E] hover:text-[#5A4112] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#88641C]" />
              <span>Inquiries: {content.phone}</span>
            </a>
            <span className="text-[#c2ab72]">|</span>
            <button
              onClick={onToggleCurrency}
              className="flex items-center gap-1 text-[#7E5C1E] hover:text-[#5A4112] transition-colors font-bold tracking-widest cursor-pointer"
              title="Switch currency display"
            >
              <span>{currency === 'PKR' ? 'PKR (Rs)' : 'USD ($)'}</span>
              <span className="text-[10px] text-[#88641C]">⇄</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row with f5eacb background and golden-colored fonts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 bg-[#f5eacb]">
        {/* Left: Moonlit Logo using given image with golden wordmark fonts */}
        <button
          onClick={() => handleNavClick('Home')}
          className="flex items-center text-left focus:outline-none group cursor-pointer"
          aria-label="Moonlit Jewelry Home"
        >
          <MoonlitLogo customUrl={content.logoUrl} size="md" theme="gold" />
        </button>

        {/* Center / Desktop Quick Navigation in golden fonts */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3">
          {['All Jewelry', 'Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Bridal Jewelry'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleNavClick(cat)}
              className={`px-3 py-1.5 text-xs font-sans tracking-[0.15em] uppercase transition-all rounded-xs cursor-pointer ${
                activeCategory === cat
                  ? 'text-[#5A4112] border-b-2 border-[#88641C] font-bold'
                  : 'text-[#7E5C1E] hover:text-[#5A4112] font-semibold hover:bg-[#ebdcb4]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Utility Buttons in golden styling */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#7E5C1E] hover:text-[#5A4112] hover:bg-[#ebdcb4] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label="Search Collection"
            title="Search jewelry"
          >
            <Search className="w-4 h-4 text-[#88641C]" />
            <span className="hidden md:inline text-xs tracking-wider uppercase font-bold text-[#7E5C1E]">
              Search
            </span>
          </button>

          {/* Inquiry / Saved Items */}
          <button
            onClick={() => onOpenInquiry()}
            className="relative p-2 text-[#7E5C1E] hover:text-[#5A4112] hover:bg-[#ebdcb4] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label="Customer Inquiries"
            title="Inquire about jewelry pieces"
          >
            <MessageSquare className="w-4 h-4 text-[#88641C]" />
            <span className="hidden md:inline text-xs tracking-wider uppercase font-bold text-[#7E5C1E]">
              Inquire
            </span>
            {inquiryCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#88641C] text-[#f5eacb] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {inquiryCount}
              </span>
            )}
          </button>

          {/* Dedicated ADMIN Button in golden tone */}
          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-1.5 text-xs font-sans font-bold tracking-[0.16em] uppercase bg-[#7E5C1E] text-[#f5eacb] hover:bg-[#684a14] hover:text-white transition-all rounded-xs shadow-xs flex items-center gap-1.5 border border-[#684a14] cursor-pointer"
            aria-label="Administrator Access"
          >
            <Lock className="w-3 h-3 text-[#f5eacb]" />
            <span>Admin</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#7E5C1E] hover:bg-[#ebdcb4] rounded-md transition-colors"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Primary Category Bar in f5eacb with golden-colored typography */}
      <nav className="hidden lg:block border-t border-[#dfcf9f] bg-[#f5eacb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center space-x-6 xl:space-x-8 py-2.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = (item === 'Home' && activeCategory === 'All Jewelry') || activeCategory === item;
              return (
                <li key={item} className="shrink-0">
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`text-xs uppercase tracking-[0.15em] font-sans transition-all duration-200 py-1 relative cursor-pointer ${
                      isActive
                        ? 'text-[#5A4112] font-bold'
                        : 'text-[#7E5C1E] hover:text-[#5A4112] font-semibold'
                    }`}
                  >
                    {item}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#88641C]" />
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
        <div className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 bg-[#f5eacb] z-50 overflow-y-auto border-t border-[#dfcf9f] p-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#88641C] font-bold border-b border-[#dfcf9f] pb-2">
              Browse Categories
            </div>
            <div className="grid grid-cols-1 gap-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`text-left py-2.5 px-3 text-sm font-sans tracking-[0.12em] uppercase transition-colors rounded ${
                    activeCategory === item || (item === 'Home' && activeCategory === 'All Jewelry')
                      ? 'bg-[#ebdcb4] text-[#5A4112] font-bold'
                      : 'text-[#7E5C1E] hover:bg-[#ebdcb4]/60 font-semibold'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#dfcf9f] space-y-3 text-xs text-[#7E5C1E] font-semibold">
            <div className="flex items-center justify-between">
              <span>Display Currency:</span>
              <button
                onClick={onToggleCurrency}
                className="px-3 py-1 bg-[#ebdcb4] rounded font-bold text-[#5A4112]"
              >
                {currency}
              </button>
            </div>
            <div className="text-[#88641C]">
              Direct Contact: {content.phone}
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 bg-[#7E5C1E] text-[#f5eacb] rounded text-center font-bold tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-[#f5eacb]" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
