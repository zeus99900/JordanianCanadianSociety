'use client';

import { useState, useEffect } from 'react';
import './splash-screen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'pouring' | 'fading'>('pouring');

  useEffect(() => {
    // Start fade out after the pouring animation
    const fadeTimer = setTimeout(() => setPhase('fading'), 3200);
    // Fully remove after fade
    const removeTimer = setTimeout(() => onComplete(), 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${phase === 'fading' ? 'splash-fade-out' : ''}`}>
      <div className="splash-content">
        <svg
          viewBox="0 0 400 350"
          className="coffee-animation"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Hand holding the Dallah (coffee pot) */}
          <g className="dallah-group">
            {/* Left hand */}
            <g className="left-hand">
              <path
                d="M120,175 C115,170 105,168 100,172 C95,176 90,180 88,185 C86,190 85,195 88,198 C90,200 95,200 100,198 L105,195 L110,192 L115,188 L120,182 Z"
                fill="#C69C6D"
              />
              {/* Fingers wrapping */}
              <path
                d="M88,185 C84,183 80,185 79,189 C78,193 80,196 84,197"
                fill="none"
                stroke="#B8895A"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            {/* Dallah - Arabic coffee pot */}
            <g className="dallah">
              {/* Body */}
              <path
                d="M95,130 C85,140 80,160 82,180 C83,190 90,195 100,198 C110,200 120,198 125,192 C130,185 132,170 128,155 C124,140 115,128 105,125 Z"
                fill="url(#dallahGradient)"
                stroke="#8B6914"
                strokeWidth="1.5"
              />
              {/* Neck */}
              <path
                d="M100,125 C98,115 97,105 98,95 C99,90 102,88 105,88 C108,88 111,90 112,95 C113,105 112,115 110,125"
                fill="url(#dallahGradient)"
                stroke="#8B6914"
                strokeWidth="1.5"
              />
              {/* Spout */}
              <path
                d="M98,95 C95,85 88,78 82,75 C80,74 78,75 78,77 C78,80 82,85 85,90"
                fill="none"
                stroke="#8B6914"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Lid / top knob */}
              <circle cx="105" cy="85" r="4" fill="#A07D1C" stroke="#8B6914" strokeWidth="1" />
              {/* Handle */}
              <path
                d="M125,140 C135,138 142,145 142,155 C142,165 135,172 125,170"
                fill="none"
                stroke="#8B6914"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Decorative band */}
              <path
                d="M86,160 C95,156 115,156 124,160"
                fill="none"
                stroke="#C8A951"
                strokeWidth="2"
              />
              <path
                d="M85,165 C95,161 115,161 125,165"
                fill="none"
                stroke="#C8A951"
                strokeWidth="1"
              />
            </g>
          </g>

          {/* Coffee stream */}
          <g className="coffee-stream">
            <path
              d="M82,77 Q160,100 240,230"
              fill="none"
              stroke="#5C3D2E"
              strokeWidth="4"
              strokeLinecap="round"
              className="stream-path"
            />
            <path
              d="M82,77 Q160,100 240,230"
              fill="none"
              stroke="#8B5E3C"
              strokeWidth="2"
              strokeLinecap="round"
              className="stream-path-highlight"
            />
          </g>

          {/* Right Hand holding the Finjal (cup) */}
          <g className="finjal-group">
            {/* Right hand */}
            <g className="right-hand">
              <path
                d="M260,250 C265,245 275,243 280,247 C285,251 290,255 292,260 C294,265 293,270 290,272 C288,274 283,274 278,272 L273,269 L268,266 L263,262 L260,256 Z"
                fill="#C69C6D"
              />
              <path
                d="M292,260 C296,258 300,260 301,264 C302,268 300,271 296,272"
                fill="none"
                stroke="#B8895A"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            {/* Finjal - small Arabic coffee cup */}
            <g className="finjal">
              {/* Cup body */}
              <path
                d="M225,235 C222,245 220,260 225,270 C228,275 240,280 255,280 C270,280 282,275 285,270 C290,260 288,245 285,235 Z"
                fill="url(#finjalGradient)"
                stroke="#8B6914"
                strokeWidth="1.5"
              />
              {/* Cup rim */}
              <ellipse cx="255" cy="235" rx="30" ry="6" fill="#C8A951" stroke="#8B6914" strokeWidth="1" />
              {/* Cup base */}
              <ellipse cx="255" cy="280" rx="15" ry="3" fill="#A07D1C" stroke="#8B6914" strokeWidth="1" />
              {/* Decorative pattern */}
              <path
                d="M228,255 C240,252 270,252 282,255"
                fill="none"
                stroke="#C8A951"
                strokeWidth="1.5"
              />
              {/* Coffee inside */}
              <ellipse cx="255" cy="238" rx="27" ry="5" fill="#5C3D2E" opacity="0" className="coffee-fill" />
            </g>
          </g>

          {/* Steam particles */}
          <g className="steam">
            <path d="M245,225 Q240,210 245,195" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" className="steam-1" />
            <path d="M255,222 Q260,205 255,190" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" className="steam-2" />
            <path d="M265,225 Q270,208 265,193" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" className="steam-3" />
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="dallahGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#B8941F" />
              <stop offset="100%" stopColor="#96780F" />
            </linearGradient>
            <linearGradient id="finjalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#C8A020" />
              <stop offset="100%" stopColor="#A07D1C" />
            </linearGradient>
          </defs>
        </svg>

        {/* Text below animation */}
        <div className="splash-text">
          <h1 className="splash-title">نشامى</h1>
          <p className="splash-subtitle">Jordanian Canadian Society</p>
        </div>
      </div>
    </div>
  );
}
