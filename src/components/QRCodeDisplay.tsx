'use client';

import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export default function QRCodeDisplay({ value, size = 256 }: QRCodeDisplayProps) {
  return (
    <div className="qr-display" id="qr-code-display">
      <div className="qr-wrapper">
        <div className="qr-border">
          <QRCode
            value={value}
            size={size}
            level="H"
            bgColor="#FAFAF8"
            fgColor="#1A1A1A"
          />
        </div>
        <div className="qr-corners">
          <span className="qr-corner qr-corner-tl" />
          <span className="qr-corner qr-corner-tr" />
          <span className="qr-corner qr-corner-bl" />
          <span className="qr-corner qr-corner-br" />
        </div>
      </div>
      <p className="qr-instruction">
        📱 Screenshot this QR code and show it at the door
      </p>
      <style>{`
        .qr-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
        }
        .qr-wrapper {
          position: relative;
          padding: var(--space-lg);
        }
        .qr-border {
          padding: var(--space-md);
          background: var(--color-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
        }
        .qr-corners {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .qr-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          border-color: var(--color-gold);
          border-style: solid;
          border-width: 0;
        }
        .qr-corner-tl { top: 0; left: 0; border-top-width: 3px; border-left-width: 3px; border-top-left-radius: 8px; }
        .qr-corner-tr { top: 0; right: 0; border-top-width: 3px; border-right-width: 3px; border-top-right-radius: 8px; }
        .qr-corner-bl { bottom: 0; left: 0; border-bottom-width: 3px; border-left-width: 3px; border-bottom-left-radius: 8px; }
        .qr-corner-br { bottom: 0; right: 0; border-bottom-width: 3px; border-right-width: 3px; border-bottom-right-radius: 8px; }
        .qr-instruction {
          font-size: var(--text-sm);
          color: var(--color-gray-500);
          text-align: center;
          font-weight: var(--font-medium);
        }
      `}</style>
    </div>
  );
}
