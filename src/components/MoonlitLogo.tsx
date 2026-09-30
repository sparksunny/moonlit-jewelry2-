import React, { useState } from 'react';
import defaultLogoImg from '../assets/images/moonlit_brand_logo_1790773623185.jpg';

interface MoonlitLogoProps {
  customUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  theme?: 'gold' | 'black' | 'default';
  className?: string;
}

export const MoonlitLogo: React.FC<MoonlitLogoProps> = ({
  customUrl,
  size = 'md',
  showWordmark = true,
  theme = 'default',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  const dimensions = {
    sm: { px: 38, text: 'text-sm' },
    md: { px: 52, text: 'text-lg' },
    lg: { px: 76, text: 'text-2xl' },
    xl: { px: 110, text: 'text-3xl' }
  }[size];

  const logoSrc = customUrl && customUrl.trim() !== '' ? customUrl : defaultLogoImg;

  // Text color styling based on theme
  const getWordmarkStyles = () => {
    if (theme === 'black') {
      return {
        title: 'text-black font-bold',
        subtitle: 'text-black font-bold'
      };
    }
    if (theme === 'gold') {
      return {
        title: 'text-[#88641C] font-bold',
        subtitle: 'text-[#9E772B] font-semibold'
      };
    }
    return {
      title: 'text-[#5A4112] font-semibold',
      subtitle: 'text-[#7E6649] font-normal'
    };
  };

  const wordmarkStyles = getWordmarkStyles();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circular Emblem Logo using the user's provided brand logo image */}
      {!imgError ? (
        <div
          className="relative rounded-full overflow-hidden shrink-0 border border-stone-300 shadow-xs bg-white transition-transform duration-300 hover:scale-105"
          style={{ width: dimensions.px, height: dimensions.px }}
        >
          <img
            src={logoSrc}
            alt="Moonlit Jewelry Logo"
            className="w-full h-full object-cover object-center"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        /* Fallback Vector Emblem */
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 transition-transform duration-300 hover:scale-105"
          style={{ width: dimensions.px, height: dimensions.px }}
          aria-label="Moonlit Jewels Logo"
        >
          <defs>
            <radialGradient id="silverSheen" cx="35%" cy="30%" r="75%" fx="30%" fy="25%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#ECECEE" />
              <stop offset="70%" stopColor="#D2D2D6" />
              <stop offset="100%" stopColor="#B4B4B8" />
            </radialGradient>
            <linearGradient id="crimsonWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D9222A" />
              <stop offset="100%" stopColor="#A81018" />
            </linearGradient>
            <linearGradient id="onyxPillar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#222222" />
              <stop offset="100%" stopColor="#101010" />
            </linearGradient>
          </defs>

          <circle cx="100" cy="100" r="97" fill="url(#silverSheen)" stroke="#18181A" strokeWidth="3.5" />
          <path d="M 100 17 L 103 26 L 112 29 L 103 32 L 100 41 L 97 32 L 88 29 L 97 26 Z" fill="#141414" />
          <polygon points="100,43 103.5,60 100,92 96.5,60" fill="#141414" />
          <polygon points="108,46 113,63 102,91 100,89" fill="#1A1A1A" />
          <polygon points="119,53 124,69 104,89 102,87" fill="#141414" />
          <polygon points="131,64 135,77 106,87 104,85" fill="#222222" />
          <polygon points="92,46 87,63 98,91 100,89" fill="#1A1A1A" />
          <polygon points="81,53 76,69 96,89 98,87" fill="#141414" />
          <polygon points="69,64 65,77 94,87 96,85" fill="#222222" />

          <polygon points="35,108 55,108 55,148 35,148" fill="url(#onyxPillar)" />
          <polygon points="145,108 165,108 165,148 145,148" fill="url(#onyxPillar)" />
          <polygon points="35,53 100,108 55,108" fill="url(#crimsonWing)" />
          <polygon points="165,53 100,108 145,108" fill="url(#crimsonWing)" />
          <polygon points="55,108 100,162 145,108 128,108 100,142 72,108" fill="#121212" />
          <polygon points="64,124 72,148 55,148" fill="#58585C" />
          <polygon points="136,124 128,148 145,148" fill="#4A4A4E" />

          <text
            x="100"
            y="178"
            textAnchor="middle"
            fill="#161413"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontSize="15"
            fontWeight="600"
            letterSpacing="0.22em"
          >
            Moonlit  jewels
          </text>
        </svg>
      )}

      {showWordmark && (
        <div className="flex flex-col text-left">
          <span className={`font-serif tracking-[0.16em] uppercase leading-none ${dimensions.text} ${wordmarkStyles.title}`}>
            Moonlit Jewelry
          </span>
          <span className={`text-[10px] tracking-[0.22em] uppercase font-sans mt-1 ${wordmarkStyles.subtitle}`}>
            Real Jewelry · Timeless Beauty
          </span>
        </div>
      )}
    </div>
  );
};
