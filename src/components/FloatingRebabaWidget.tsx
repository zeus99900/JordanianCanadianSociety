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
            <linearGradient id="rebabaWood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5C3A21" />
              <stop offset="50%" stopColor="#8B5A2B" />
              <stop offset="100%" stopColor="#5C3A21" />
            </linearGradient>
            <linearGradient id="rebabaSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6C89A" />
              <stop offset="100%" stopColor="#C49A5A" />
            </linearGradient>
          </defs>

          {/* THE NECK (Wooden Rod) */}
          <rect x="76" y="20" width="8" height="200" rx="4" fill="url(#rebabaWood)" />
          {/* Top Decorative Peg/Head */}
          <path d="M72 20 H88 L84 5 H76 Z" fill="#3A2110" />
          <circle cx="80" cy="35" r="6" fill="#3A2110" />
          {/* Tuning Peg */}
          <rect x="60" y="45" width="20" height="6" rx="2" fill="#3A2110" />

          {/* THE SKIN BODY (Square الطارة) */}
          {/* Back skin layer shadow */}
          <rect x="40" y="120" width="80" height="80" rx="8" fill="url(#rebabaSkin)" stroke="url(#rebabaWood)" strokeWidth="4" />
          
          {/* Traditional Brass Tacks (Decorative dots around the frame) */}
          <g fill="url(#rebabaGoldGrad)">
            <circle cx="46" cy="126" r="2" />
            <circle cx="60" cy="126" r="2" />
            <circle cx="80" cy="126" r="2" />
            <circle cx="100" cy="126" r="2" />
            <circle cx="114" cy="126" r="2" />
            <circle cx="46" cy="146" r="2" />
            <circle cx="114" cy="146" r="2" />
            <circle cx="46" cy="174" r="2" />
            <circle cx="114" cy="174" r="2" />
            <circle cx="46" cy="194" r="2" />
            <circle cx="60" cy="194" r="2" />
            <circle cx="80" cy="194" r="2" />
            <circle cx="100" cy="194" r="2" />
            <circle cx="114" cy="194" r="2" />
          </g>

          {/* THE SINGLE STRING (Vibrating) */}
          <motion.line
            x1="80"
            y1="45"
            x2="80"
            y2="210"
            stroke="url(#rebabaGoldGrad)"
            strokeWidth="2"
            variants={stringVariants}
            animate="animate"
          />

          {/* THE ANIMATED BOW (القوس) */}
          <motion.g
            variants={bowVariants}
            animate="animate"
            style={{ originX: "60px", originY: "150px" }}
          >
            {/* The Curved Wood Stick */}
            <path
              d="M30 110 C 25 150, 45 180, 85 195"
              stroke="url(#rebabaWood)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* The Bow Horsehair String */}
            <line
              x1="32"
              y1="112"
              x2="83"
              y2="192"
              stroke="#F5F5DC"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.g>
          
          {/* Bottom Spike/Foot */}
          <rect x="77" y="220" width="6" height="15" rx="2" fill="#3A2110" />
        </svg>
      </div>
    </div>
  );
}
