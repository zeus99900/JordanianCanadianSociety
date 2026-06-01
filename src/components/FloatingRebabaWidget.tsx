'use client';

import React, { useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import './floating-rebaba.css';

export default function FloatingRebabaWidget() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMouseEnter = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const handleMouseLeave = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      // Optional: reset to beginning when hover stops
      // audioRef.current.currentTime = 0; 
    }
  };

  // Animation for the bow sliding horizontally back and forth
  const bowVariants: Variants = {
    animate: {
      x: [-30, 30, -30],       // Slides the bow left and right across the string
      y: [0, 0, 0],            // Keep it perfectly horizontal
      rotate: [0, 0, 0],
      transition: {
        duration: 4,           // Speed of the bowing stroke
        ease: "easeInOut",
        repeat: Infinity,
      }
    }
  };

  // Subtle vibration for the main string when played
  const stringVariants: Variants = {
    animate: {
      skewX: [0, 1, -1, 0],
      transition: {
        duration: 0.15,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div 
      className="floating-rebaba-widget" 
      aria-hidden="true"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} loop src="/rababa-music.mp3" preload="auto" />
      
      {/* Frosted glass container matching the Nashama theme */}
      <div className="floating-rebaba-container">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 160 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich textures for the real Rababa look */}
            <linearGradient id="woodDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3d2612" />
              <stop offset="50%" stopColor="#5c3a1c" />
              <stop offset="100%" stopColor="#3d2612" />
            </linearGradient>
            
            <linearGradient id="parchmentSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d6b987" />
              <stop offset="50%" stopColor="#c39d5c" />
              <stop offset="100%" stopColor="#a37b3b" />
            </linearGradient>

            <linearGradient id="brassTack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff2cc" />
              <stop offset="100%" stopColor="#b38600" />
            </linearGradient>
          </defs>

          {/* ===== THE NECK (Central Pole) ===== */}
          {/* Main rod */}
          <rect x="76" y="20" width="8" height="230" rx="4" fill="url(#woodDark)" />
          {/* Ornate turnings at the top */}
          <ellipse cx="80" cy="20" rx="4" ry="8" fill="#3d2612" />
          <rect x="74" y="30" width="12" height="10" rx="4" fill="url(#woodDark)" />
          <rect x="75" y="45" width="10" height="15" rx="5" fill="url(#woodDark)" />
          <rect x="74" y="65" width="12" height="8" rx="3" fill="url(#woodDark)" />

          {/* ===== TUNING PEG (Right Side) ===== */}
          {/* Peg sticking out to the right */}
          <rect x="80" y="70" width="22" height="6" rx="3" fill="url(#woodDark)" transform="rotate(-10 80 70)" />
          <circle cx="102" cy="66" r="4" fill="#3d2612" />

          {/* ===== THE FRAME (Side Horns) ===== */}
          {/* Left wooden frame piece */}
          <path d="M40 120 C 55 170, 55 210, 40 270" stroke="url(#woodDark)" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Right wooden frame piece */}
          <path d="M120 120 C 105 170, 105 210, 120 270" stroke="url(#woodDark)" strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* ===== THE SKIN BODY (Parchment) ===== */}
          {/* Stretched between the wooden side frames */}
          <path 
            d="M 49 145 L 111 145 C 104 170, 104 210, 111 245 L 49 245 C 56 210, 56 170, 49 145 Z" 
            fill="url(#parchmentSkin)" 
            stroke="#5c3a1c" 
            strokeWidth="1.5" 
          />

          {/* ===== BRASS TACKS ===== */}
          {/* Top edge */}
          <circle cx="55" cy="148" r="2.5" fill="url(#brassTack)" />
          <circle cx="70" cy="148" r="2.5" fill="url(#brassTack)" />
          <circle cx="85" cy="148" r="2.5" fill="url(#brassTack)" />
          <circle cx="100" cy="148" r="2.5" fill="url(#brassTack)" />
          {/* Bottom edge */}
          <circle cx="55" cy="242" r="2.5" fill="url(#brassTack)" />
          <circle cx="70" cy="242" r="2.5" fill="url(#brassTack)" />
          <circle cx="85" cy="242" r="2.5" fill="url(#brassTack)" />
          <circle cx="100" cy="242" r="2.5" fill="url(#brassTack)" />
          {/* Left edge */}
          <circle cx="52" cy="165" r="2.5" fill="url(#brassTack)" />
          <circle cx="53.5" cy="185" r="2.5" fill="url(#brassTack)" />
          <circle cx="54" cy="205" r="2.5" fill="url(#brassTack)" />
          <circle cx="53.5" cy="225" r="2.5" fill="url(#brassTack)" />
          {/* Right edge */}
          <circle cx="108" cy="165" r="2.5" fill="url(#brassTack)" />
          <circle cx="106.5" cy="185" r="2.5" fill="url(#brassTack)" />
          <circle cx="106" cy="205" r="2.5" fill="url(#brassTack)" />
          <circle cx="106.5" cy="225" r="2.5" fill="url(#brassTack)" />

          {/* ===== THE SINGLE STRING (Black, taut) ===== */}
          <motion.line
            x1="80"
            y1="70"
            x2="80"
            y2="250"
            stroke="#1a1a1a"
            strokeWidth="2"
            variants={stringVariants}
            animate="animate"
          />

          {/* ===== THE ANIMATED BOW (Horizontal) ===== */}
          <motion.g
            variants={bowVariants}
            animate="animate"
          >
            {/* The Bow Wood (Curved down) */}
            <path
              d="M10 200 C 50 240, 110 240, 150 200"
              stroke="#a37b3b"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* The Horsehair String */}
            <line
              x1="10"
              y1="200"
              x2="150"
              y2="200"
              stroke="#f4e8c1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </motion.g>
        </svg>
      </div>
    </div>
  );
}
