'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import './floating-widget.css';

export default function FloatingCoffeeWidget() {
  // Animation variants for the Teapot tilting
  const teapotVariants: Variants = {
    animate: {
      rotate: [0, 35, 35, 0], // Tilts to pour, holds, then stands back up
      x: [0, 10, 10, 0],      // Slight forward movement
      y: [0, -10, -10, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.5
      }
    }
  };

  // Animation variants for the pouring liquid stream
  const streamVariants: Variants = {
    animate: {
      pathLength: [0, 0, 1, 1, 0], // Appears only when tilted, fills, then drains
      opacity: [0, 1, 1, 1, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.5,
        times: [0, 0.3, 0.45, 0.8, 1] 
      }
    }
  };

  // Cup slight reaction
  const cupVariants: Variants = {
    animate: {
      y: [0, 0, 4, 0, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.5,
        times: [0, 0.4, 0.5, 0.8, 1]
      }
    }
  };

  const strokeWidth = "6";

  return (
    <div 
      className="floating-coffee-widget"
      aria-hidden="true"
    >
      <div className="floating-widget-container">
        <svg
          width="120"
          height="120"
          viewBox="100 0 250 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="widgetGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8D48B" />
              <stop offset="50%" stopColor="#B8941F" />
              <stop offset="100%" stopColor="#96780F" />
            </linearGradient>
            <linearGradient id="widgetGoldFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(232, 212, 139, 0.2)" />
              <stop offset="100%" stopColor="rgba(150, 120, 15, 0.4)" />
            </linearGradient>
            <linearGradient id="widgetCoffeeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6B3A1F" />
              <stop offset="100%" stopColor="#3B1F0B" />
            </linearGradient>
          </defs>

          {/* Animated Teapot Group */}
          <motion.g
            variants={teapotVariants}
            animate="animate"
            style={{ originX: "190px", originY: "210px" }} // Rotate around the base/spout junction
          >
            {/* SPOUT */}
            <path
              d="M128,120 C150,110 160,70 165,25 L160,22 C155,50 140,65 109,80 Z"
              fill="url(#widgetGoldFill)"
              stroke="none"
            />
            <path d="M128,120 C150,110 160,70 165,25" fill="none" stroke="url(#widgetGoldGrad)" strokeWidth="4" />
            <path d="M160,22 C155,50 140,65 109,80" fill="none" stroke="url(#widgetGoldGrad)" strokeWidth="4" />
            {/* Spout tip */}
            <ellipse cx="162.5" cy="23.5" rx="1.5" ry="3" fill="#2A1C0E" transform="rotate(35 162.5 23.5)" />

            {/* Dallah (Teapot) Body Outlines */}
            <path
              d="M130 150 C130 110, 160 90, 180 90 C200 90, 210 110, 210 150 L220 220 L120 220 Z"
              stroke="url(#widgetGoldGrad)"
              strokeWidth={strokeWidth}
              fill="url(#widgetGoldFill)"
              strokeLinejoin="round"
            />
            {/* Lid / Top Finial */}
            <path
              d="M165 90 L165 60 C165 50, 180 40, 180 40 C180 40, 195 50, 195 60 L195 90"
              stroke="url(#widgetGoldGrad)"
              strokeWidth={strokeWidth}
              fill="url(#widgetGoldFill)"
              strokeLinejoin="round"
            />
            <path d="M155 90 L205 90" stroke="url(#widgetGoldGrad)" strokeWidth={strokeWidth} />
            
            {/* Handle */}
            <path
              d="M132 140 C90 140, 90 210, 122 215"
              stroke="url(#widgetGoldGrad)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Base */}
            <path
              d="M120 220 L110 260 L230 260 L220 220 Z"
              stroke="url(#widgetGoldGrad)"
              strokeWidth={strokeWidth}
              fill="url(#widgetGoldFill)"
              strokeLinejoin="round"
            />
          </motion.g>

          {/* Animated Liquid Stream */}
          <motion.path
            d="M267,82 C280,140 305,200 330,260"
            stroke="url(#widgetCoffeeGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            variants={streamVariants}
            animate="animate"
            style={{ pathLength: 0 }}
          />

          {/* Cup (Finjal) */}
          <motion.g
            variants={cupVariants}
            animate="animate"
            style={{ transformOrigin: '280px 240px', scale: 0.8, x: 50, y: -80 }}
          >
            {/* Cup Body */}
            <path
              d="M245 320 C245 350, 307 350, 307 320 Z"
              stroke="url(#widgetGoldGrad)"
              strokeWidth={strokeWidth}
              fill="url(#widgetGoldFill)"
              strokeLinejoin="round"
            />
            {/* Cup Base */}
            <path
              d="M265 345 L260 355 L292 355 L287 345"
              stroke="url(#widgetGoldGrad)"
              strokeWidth="4"
              fill="url(#widgetGoldFill)"
              strokeLinejoin="round"
            />
          </motion.g>
        </svg>
      </div>
    </div>
  );
}
