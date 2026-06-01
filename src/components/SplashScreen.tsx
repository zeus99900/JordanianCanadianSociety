'use client';

import { useState, useEffect } from 'react';
import './splash-screen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'pouring' | 'fading'>('pouring');

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('fading'), 3400);
    const removeTimer = setTimeout(() => onComplete(), 4200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${phase === 'fading' ? 'splash-fade-out' : ''}`}>
      <div className="splash-content">
        <svg
          viewBox="0 0 500 420"
          className="coffee-animation"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic gold gradient for the dallah */}
            <linearGradient id="dallahBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8D48B" />
              <stop offset="25%" stopColor="#C8A84E" />
              <stop offset="50%" stopColor="#B8941F" />
              <stop offset="75%" stopColor="#D4B85A" />
              <stop offset="100%" stopColor="#96780F" />
            </linearGradient>
            <linearGradient id="dallahDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A07D1C" />
              <stop offset="50%" stopColor="#8B6914" />
              <stop offset="100%" stopColor="#705510" />
            </linearGradient>
            <linearGradient id="finjalBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8D48B" />
              <stop offset="30%" stopColor="#C8A84E" />
              <stop offset="60%" stopColor="#B8941F" />
              <stop offset="100%" stopColor="#D4B85A" />
            </linearGradient>
            <linearGradient id="coffeeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5C3317" />
              <stop offset="100%" stopColor="#3B1F0B" />
            </linearGradient>
            <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A574" />
              <stop offset="50%" stopColor="#C69C6D" />
              <stop offset="100%" stopColor="#B8895A" />
            </linearGradient>
            <linearGradient id="handGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C69C6D" />
              <stop offset="50%" stopColor="#B8895A" />
              <stop offset="100%" stopColor="#A67B4B" />
            </linearGradient>
            {/* Shine effect */}
            <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            {/* Shadow filter */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
            </filter>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* ===== LEFT SIDE: Hand + Dallah ===== */}
          <g className="dallah-group" filter="url(#shadow)">
            {/* Left hand / arm */}
            <g className="left-hand">
              <path
                d="M45,210 C50,200 60,190 75,185 C85,182 95,182 105,185 L118,192 L115,208 C108,215 95,218 82,218 C65,218 50,216 45,210 Z"
                fill="url(#handGrad)"
                stroke="#A67B4B"
                strokeWidth="0.5"
              />
              <path
                d="M105,185 C112,180 118,178 122,180 C126,183 126,188 123,192 L118,195"
                fill="url(#handGrad)"
                stroke="#A67B4B"
                strokeWidth="0.5"
              />
              <path d="M75,200 C80,198 88,197 95,198" fill="none" stroke="#A67B4B" strokeWidth="0.5" opacity="0.5" />
              <path d="M70,205 C78,203 88,202 98,204" fill="none" stroke="#A67B4B" strokeWidth="0.5" opacity="0.4" />
            </g>

            {/* ---- DALLAH (Arabic Coffee Pot) ---- */}
            <g className="dallah">
              {/* SPOUT — elegant, slender, curved dallah beak */}
              <path
                d="M128,120 C150,110 160,70 165,25 L160,22 C155,50 140,65 109,80 Z"
                fill="url(#dallahBody)"
                stroke="none"
              />
              <path d="M128,120 C150,110 160,70 165,25" fill="none" stroke="#8B6914" strokeWidth="1" />
              <path d="M160,22 C155,50 140,65 109,80" fill="none" stroke="#8B6914" strokeWidth="1" />
              {/* Spout tip */}
              <ellipse cx="162.5" cy="23.5" rx="1.5" ry="3" fill="url(#dallahDark)" transform="rotate(35 162.5 23.5)" />

              {/* Main body */}
              <path
                d="M80,175 
                   C72,165 68,150 70,135 
                   C72,120 78,110 88,105 
                   C92,103 96,102 100,102 
                   C104,102 108,103 112,105 
                   C122,110 128,120 130,135 
                   C132,150 128,165 120,175 
                   C116,180 112,183 108,185 
                   C104,187 96,187 92,185 
                   C88,183 84,180 80,175 Z"
                fill="url(#dallahBody)"
                stroke="#8B6914"
                strokeWidth="1"
              />
              <path
                d="M88,115 C90,110 96,107 100,107 C98,120 95,145 97,170"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Neck */}
              <path
                d="M93,102 
                   C92,95 91,85 91,75 
                   C91,65 92,55 94,48 
                   C96,43 98,40 100,38 
                   C102,40 104,43 106,48 
                   C108,55 109,65 109,75 
                   C109,85 108,95 107,102"
                fill="url(#dallahBody)"
                stroke="#8B6914"
                strokeWidth="1"
              />
              <path d="M97,50 L97,95" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

              {/* Lid / finial */}
              <ellipse cx="100" cy="38" rx="8" ry="3" fill="url(#dallahDark)" stroke="#8B6914" strokeWidth="0.8" />
              <path d="M98,35 C98,30 100,26 100,23 C100,26 102,30 102,35" fill="url(#dallahBody)" stroke="#8B6914" strokeWidth="0.8" />
              <circle cx="100" cy="22" r="3" fill="url(#dallahBody)" stroke="#8B6914" strokeWidth="0.8" />

              {/* HANDLE — on LEFT side (opposite spout) */}
              <path
                d="M91,70 
                   C82,68 74,72 70,80 
                   C66,88 66,100 68,110 
                   C70,120 74,128 80,132 
                   C84,134 87,132 88,128"
                fill="none"
                stroke="url(#dallahBody)"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M90,73 
                   C83,72 77,76 74,82 
                   C71,88 71,98 72,108 
                   C73,116 76,123 81,126"
                fill="none"
                stroke="#8B6914"
                strokeWidth="0.5"
              />

              {/* Decorative bands */}
              <path d="M76,145 C85,140 115,140 124,145" fill="none" stroke="#C8A951" strokeWidth="1.5" />
              <path d="M74,150 C84,145 116,145 126,150" fill="none" stroke="#E8D48B" strokeWidth="0.8" />
              <path d="M76,155 C85,150 115,150 124,155" fill="none" stroke="#C8A951" strokeWidth="1.5" />
              <path d="M93,80 C95,79 105,79 107,80" fill="none" stroke="#C8A951" strokeWidth="1.2" />
              <path d="M93,83 C95,82 105,82 107,83" fill="none" stroke="#C8A951" strokeWidth="1.2" />

              {/* Base */}
              <ellipse cx="100" cy="186" rx="16" ry="4" fill="url(#dallahDark)" stroke="#8B6914" strokeWidth="0.8" />
            </g>
          </g>

          {/* ===== COFFEE STREAM (from spout tip on right, curving down to cup) ===== */}
          <g className="coffee-stream">
            <path
              d="M267,82 C280,140 305,200 330,260"
              fill="none"
              stroke="#3B1F0B"
              strokeWidth="5"
              strokeLinecap="round"
              className="stream-path"
              pathLength="100"
            />
            <path
              d="M267,82 C280,140 305,200 330,260"
              fill="none"
              stroke="#6B3A1F"
              strokeWidth="3"
              strokeLinecap="round"
              className="stream-path-inner"
              pathLength="100"
            />
            <path
              d="M267,82 C280,140 305,200 330,260"
              fill="none"
              stroke="#8B5E3C"
              strokeWidth="1"
              strokeLinecap="round"
              className="stream-path-highlight"
              pathLength="100"
            />
            {/* Splash drops at cup */}
            <circle cx="325" cy="262" r="2" fill="#5C3317" className="drop drop-1" />
            <circle cx="335" cy="258" r="1.5" fill="#5C3317" className="drop drop-2" />
            <circle cx="330" cy="255" r="1" fill="#5C3317" className="drop drop-3" />
          </g>

          {/* ===== RIGHT SIDE: Hand + Finjal ===== */}
          <g className="finjal-group" filter="url(#softShadow)">
            {/* Right hand */}
            <g className="right-hand">
              {/* Palm and forearm */}
              <path
                d="M355,310 C360,300 370,290 385,285 C395,282 405,282 415,285 L428,292 L425,310 C418,318 405,322 390,322 C375,322 360,318 355,310 Z"
                fill="url(#handGrad2)"
                stroke="#A67B4B"
                strokeWidth="0.5"
              />
              {/* Thumb */}
              <path
                d="M355,310 C348,305 344,298 346,294 C348,290 352,289 356,292 L360,296"
                fill="url(#handGrad2)"
                stroke="#A67B4B"
                strokeWidth="0.5"
              />
              {/* Finger lines */}
              <path d="M380,302 C388,300 398,299 408,301" fill="none" stroke="#A67B4B" strokeWidth="0.5" opacity="0.4" />
              <path d="M375,308 C385,305 398,304 410,307" fill="none" stroke="#A67B4B" strokeWidth="0.5" opacity="0.3" />
            </g>

            {/* ---- FINJAL (Small Arabic Coffee Cup) ---- */}
            <g className="finjal">
              {/* Cup body - distinctive flared top, narrow waist, wider bottom */}
              <path
                d="M295,270 
                   C290,275 288,282 290,290 
                   C291,295 294,300 300,305 
                   C310,312 330,316 345,316 
                   C360,316 375,312 382,305 
                   C388,300 390,295 391,290 
                   C393,282 391,275 386,270 
                   Z"
                fill="url(#finjalBody)"
                stroke="#8B6914"
                strokeWidth="1"
              />
              {/* Cup shine */}
              <path
                d="M310,275 C312,280 313,295 316,310"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Rim - elegant lip at top */}
              <ellipse cx="340" cy="270" rx="46" ry="8" fill="url(#dallahBody)" stroke="#8B6914" strokeWidth="0.8" />
              <ellipse cx="340" cy="270" rx="43" ry="6" fill="url(#dallahDark)" stroke="none" />
              
              {/* Coffee surface inside */}
              <ellipse cx="340" cy="271" rx="40" ry="5" fill="url(#coffeeGrad)" opacity="0" className="coffee-fill" />

              {/* Decorative band around middle */}
              <path d="M292,288 C310,283 365,283 389,288" fill="none" stroke="#E8D48B" strokeWidth="1.2" />
              <path d="M293,292 C310,287 365,287 388,292" fill="none" stroke="#C8A951" strokeWidth="0.8" />

              {/* Small geometric pattern on band */}
              <path d="M320,285 L325,290 L330,285 L335,290 L340,285 L345,290 L350,285 L355,290 L360,285" 
                    fill="none" stroke="#E8D48B" strokeWidth="0.6" opacity="0.6" />

              {/* Base / foot */}
              <ellipse cx="340" cy="316" rx="20" ry="4" fill="url(#dallahDark)" stroke="#8B6914" strokeWidth="0.8" />
              <path
                d="M325,316 C328,320 335,323 340,323 C345,323 352,320 355,316"
                fill="url(#dallahDark)"
                stroke="#8B6914"
                strokeWidth="0.8"
              />
              <ellipse cx="340" cy="323" rx="10" ry="3" fill="url(#dallahBody)" stroke="#8B6914" strokeWidth="0.8" />
            </g>
          </g>

          {/* ===== STEAM ===== */}
          <g className="steam">
            <path d="M325,260 Q318,240 325,220" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" className="steam-1" />
            <path d="M340,258 Q347,235 340,215" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" className="steam-2" />
            <path d="M355,260 Q362,238 355,218" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" className="steam-3" />
          </g>
        </svg>

        {/* Text */}
        <div className="splash-text">
          <h1 className="splash-title">نشامى</h1>
          <p className="splash-subtitle">Jordanian Canadian Society</p>
        </div>
      </div>
    </div>
  );
}
