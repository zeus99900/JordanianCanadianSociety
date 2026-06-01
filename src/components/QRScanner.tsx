'use client';

import { useEffect, useRef, useState } from 'react';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  isActive: boolean;
}

export default function QRScanner({ onScan, isActive }: QRScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<InstanceType<typeof import('html5-qrcode').Html5Qrcode> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const lastScanRef = useRef<string>('');
  const lastScanTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    let mounted = true;

    const startScanner = async () => {
      setIsStarting(true);
      setError(null);

      try {
        const { Html5Qrcode } = await import('html5-qrcode');

        if (!mounted) return;

        const scanner = new Html5Qrcode('qr-scanner-container');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            // Debounce: prevent duplicate scans within 3 seconds
            const now = Date.now();
            if (
              decodedText === lastScanRef.current &&
              now - lastScanTimeRef.current < 3000
            ) {
              return;
            }
            lastScanRef.current = decodedText;
            lastScanTimeRef.current = now;
            onScan(decodedText);
          },
          () => {
            // Scan error — ignored (happens on every non-QR frame)
          }
        );

        setIsStarting(false);
      } catch (err) {
        if (!mounted) return;
        console.error('QR Scanner error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to start camera. Please allow camera access.'
        );
        setIsStarting(false);
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [isActive, onScan]);

  if (!isActive) return null;

  return (
    <div className="qr-scanner-wrapper">
      {isStarting && (
        <div className="scanner-loading">
          <div className="spinner" />
          <p>Starting camera...</p>
        </div>
      )}

      {error && (
        <div className="scanner-error">
          <p>📷 {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-sm btn-outline"
          >
            Retry
          </button>
        </div>
      )}

      <div
        id="qr-scanner-container"
        ref={containerRef}
        className="scanner-viewport"
      />

      <style>{`
        .qr-scanner-wrapper {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }
        .scanner-viewport {
          width: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .scanner-viewport video {
          border-radius: var(--radius-md);
        }
        .scanner-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-2xl);
          color: var(--color-gray-400);
        }
        .scanner-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-lg);
          background: rgba(239, 68, 68, 0.1);
          border-radius: var(--radius-md);
          text-align: center;
          color: var(--color-error);
          font-size: var(--text-sm);
        }
      `}</style>
    </div>
  );
}
