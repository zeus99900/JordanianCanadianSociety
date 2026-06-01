'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import './navbar.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <header className="navbar glass" id="main-navbar">
      <div className="navbar-inner container">
        <Link href="/" className="navbar-logo" id="logo-link">
          <span className="logo-icon">✦</span>
          <div className="logo-text">
            <span className="logo-title">JCS</span>
            <span className="logo-subtitle">Jordanian Canadian Society</span>
          </div>
        </Link>

        <nav className={`navbar-nav ${isMenuOpen ? 'open' : ''}`} id="main-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              id={`nav-${link.label.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
              <span className="nav-link-underline" />
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '12px 16px' }}>
              Logout
            </button>
          ) : (
            <Link href="/auth/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Login
              <span className="nav-link-underline" />
            </Link>
          )}
        </nav>

        <button
          className={`navbar-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          id="nav-toggle"
        >
          <span className="toggle-line" />
          <span className="toggle-line" />
          <span className="toggle-line" />
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="navbar-backdrop"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
