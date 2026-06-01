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
          viewBox="0 0 160 260"
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

          {/* ===== ORNAMENTAL HEAD (small diamond knob) ===== */}
          <path d="M90 8 L95 16 L90 24 L85 16 Z" stroke="url(#rebabaGoldGrad)" strokeWidth="2" fill="none" />

          {/* ===== THE NECK (thick vertical line offset to the right) ===== */}
          <line x1="90" y1="24" x2="90" y2="140" stroke="url(#rebabaGoldGrad)" strokeWidth="4" strokeLinecap="round" />

          {/* ===== TUNING PEG (horizontal bar connecting string to neck) ===== */}
          <line x1="62" y1="50" x2="90" y2="50" stroke="url(#rebabaGoldGrad)" strokeWidth="3" strokeLinecap="round" />
          {/* Small knob at end of peg */}
          <circle cx="62" cy="50" r="3" stroke="url(#rebabaGoldGrad)" strokeWidth="1.5" fill="none" />

          {/* ===== THE BODY — )_( shape with crossing bars ===== */}
          {/* Left side ) */}
          <path d="M50 115 C 75 135, 75 195, 50 215" stroke="url(#rebabaGoldGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Right side ( */}
          <path d="M110 115 C 85 135, 85 195, 110 215" stroke="url(#rebabaGoldGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          
          {/* Top cross bar */}
          <line x1="35" y1="140" x2="125" y2="140" stroke="url(#rebabaGoldGrad)" strokeWidth="3" strokeLinecap="round" />
          {/* Bottom cross bar */}
          <line x1="35" y1="190" x2="125" y2="190" stroke="url(#rebabaGoldGrad)" strokeWidth="3" strokeLinecap="round" />

          {/* ===== BOTTOM SPIKE (line extending below body) ===== */}
          <line x1="80" y1="215" x2="80" y2="250" stroke="url(#rebabaGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Small foot */}
          <line x1="73" y1="250" x2="87" y2="250" stroke="url(#rebabaGoldGrad)" strokeWidth="2" strokeLinecap="round" />

          {/* ===== THE SINGLE STRING (vibrating, white) ===== */}
          <motion.line
            x1="80"
            y1="50"
            x2="80"
            y2="215"
            stroke="#ffffff"
            strokeWidth="1"
            variants={stringVariants}
            animate="animate"
            style={{ opacity: 0.7 }}
          />

          {/* ===== THE ANIMATED BOW (القوس) ===== */}
          <motion.g
            variants={bowVariants}
            animate="animate"
            style={{ originX: "80px", originY: "165px" }}
          >
            {/* Curved bow stick */}
            <path
              d="M25 145 C 40 165, 70 185, 135 175"
              stroke="url(#rebabaGoldGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Bow horsehair (taut line) */}
            <line
              x1="25"
              y1="145"
              x2="135"
              y2="175"
              stroke="#E8D48B"
              strokeWidth="1"
              strokeLinecap="round"
              style={{ opacity: 0.5 }}
            />
          </motion.g>
        </svg>
      </div>
    </div>
  );
}
