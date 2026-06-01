'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import './floating-rebaba.css';

export default function FloatingRebabaWidget() {
  // Animation for the bow rocking/sliding back and forth
  const bowVariants: Variants = {
    animate: {
      rotate: [-15, 10, -15],  // Tilts the bow as it moves
      x: [-15, 20, -15],       // Slides the bow across the string
      y: [0, -5, 0],           // Slight natural vertical movement
      transition: {
        duration: 4,           // Speed of the bowing stroke (slower)
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
    <div className="floating-rebaba-widget" aria-hidden="true">
      {/* Frosted glass container matching the Nashama theme */}
      <div className="floating-rebaba-container">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 160 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rebabaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8D48B" />
              <stop offset="50%" stopColor="#B8941F" />
              <stop offset="100%" stopColor="#96780F" />
            </linearGradient>
          </defs>

          {/* THE NECK & SPIKE (Single elegant vertical line) */}
          <line x1="80" y1="20" x2="80" y2="230" stroke="url(#rebabaGoldGrad)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Top Tuning Peg (Simple horizontal dash) */}
          <line x1="65" y1="45" x2="95" y2="45" stroke="url(#rebabaGoldGrad)" strokeWidth="3" strokeLinecap="round" />

          {/* THE BODY (Minimalist )_( curves) */}
          {/* Left curve */}
          <path d="M60 120 C 30 140, 30 180, 60 200" stroke="url(#rebabaGoldGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Right curve */}
          <path d="M100 120 C 130 140, 130 180, 100 200" stroke="url(#rebabaGoldGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Top connecting line */}
          <line x1="60" y1="120" x2="100" y2="120" stroke="url(#rebabaGoldGrad)" strokeWidth="3" strokeLinecap="round" />
          {/* Bottom connecting line */}
          <line x1="60" y1="200" x2="100" y2="200" stroke="url(#rebabaGoldGrad)" strokeWidth="3" strokeLinecap="round" />

          {/* THE SINGLE STRING (Vibrating) */}
          <motion.line
            x1="80"
            y1="45"
            x2="80"
            y2="210"
            stroke="#ffffff"
            strokeWidth="1.5"
            variants={stringVariants}
            animate="animate"
            style={{ opacity: 0.8 }}
          />

          {/* THE ANIMATED BOW (القوس) */}
          <motion.g
            variants={bowVariants}
            animate="animate"
            style={{ originX: "80px", originY: "160px" }}
          >
            {/* The Curved Wood Stick */}
            <path
              d="M30 140 C 30 160, 50 190, 130 180"
              stroke="url(#rebabaGoldGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* The Bow Horsehair String */}
            <line
              x1="30"
              y1="140"
              x2="130"
              y2="180"
              stroke="#E8D48B"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ opacity: 0.6 }}
            />
          </motion.g>
        </svg>
      </div>
    </div>
  );
}
