'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import './splash-screen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'pouring' | 'fading'>('pouring');

  useEffect(() => {
    // Hide splash screen after one full loop and a bit
    const fadeTimer = setTimeout(() => setPhase('fading'), 3500);
    const removeTimer = setTimeout(() => onComplete(), 4300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  // Animation variants for the Teapot tilting
  const teapotVariants: Variants = {
    animate: {
      rotate: [0, 35, 35, 0], // Tilts to pour (positive for right-side), holds, then stands back up
      x: [0, 10, 10, 0],      // Slight forward movement
      y: [0, -10, -10, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: 0, // Only play once for splash screen
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
        repeat: 0,
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
        repeat: 0,
        times: [0, 0.4, 0.5, 0.8, 1]
      }
    }
  };

  const colorGold = "#C8A951";
  const strokeWidth = "6";

  return (
    <div className={`splash-screen ${phase === 'fading' ? 'splash-fade-out' : ''}`}>
      <div className="splash-content">
        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="coffee-animation-framer"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8D48B" />
              <stop offset="50%" stopColor="#B8941F" />
              <stop offset="100%" stopColor="#96780F" />
            </linearGradient>
            <linearGradient id="goldFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(232, 212, 139, 0.2)" />
              <stop offset="100%" stopColor="rgba(150, 120, 15, 0.4)" />
            </linearGradient>
            <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
            {/* Dallah (Teapot) Body Outlines */}
            <path
              d="M130 150 C130 110, 160 90, 180 90 C200 90, 210 110, 210 150 L220 220 L120 220 Z"
              stroke="url(#goldGradient)"
              strokeWidth={strokeWidth}
              fill="url(#goldFill)"
              strokeLinejoin="round"
            />
            {/* Lid / Top Finial */}
            <path
              d="M165 90 L165 60 C165 50, 180 40, 180 40 C180 40, 195 50, 195 60 L195 90"
              stroke="url(#goldGradient)"
              strokeWidth={strokeWidth}
              fill="url(#goldFill)"
              strokeLinejoin="round"
            />
            <path d="M155 90 L205 90" stroke="url(#goldGradient)" strokeWidth={strokeWidth} />
            
            {/* Handle */}
            <path
              d="M132 140 C90 140, 90 210, 122 215"
              stroke="url(#goldGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Spout */}
            <path
              d="M215 175 C230 175, 270 140, 280 140 C270 160, 240 210, 218 210 Z"
              stroke="url(#goldGradient)"
              strokeWidth={strokeWidth}
              fill="url(#goldFill)"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            
            {/* Base */}
            <path
              d="M120 220 L110 260 L230 260 L220 220 Z"
              stroke="url(#goldGradient)"
              strokeWidth={strokeWidth}
              fill="url(#goldFill)"
              strokeLinejoin="round"
            />
          </motion.g>

          {/* Animated Liquid Stream */}
          <motion.path
            d="M276 145 L276 335" // Drops down into the cup
            stroke="url(#coffeeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            variants={streamVariants}
            animate="animate"
            style={{ pathLength: 0 }} // Explicit starting point for framer motion
          />

          {/* Cup (Finjal) */}
          <motion.g
            variants={cupVariants}
            animate="animate"
          >
            {/* Cup Body */}
            <path
              d="M245 320 C245 350, 307 350, 307 320 Z"
              stroke="url(#goldGradient)"
              strokeWidth={strokeWidth}
              fill="url(#goldFill)"
              strokeLinejoin="round"
            />
            {/* Cup Base */}
            <path
              d="M265 345 L260 355 L292 355 L287 345"
              stroke="url(#goldGradient)"
              strokeWidth="4"
              fill="url(#goldFill)"
              strokeLinejoin="round"
            />
          </motion.g>
        </svg>

        {/* Text */}
        <div className="splash-text">
          <h1 className="splash-title arabic">ملتقى النشامى للجالية الأردنية في كندا</h1>
          <p className="splash-subtitle">Jordanian Canadian Nashama Society</p>
        </div>
      </div>
    </div>
  );
}
