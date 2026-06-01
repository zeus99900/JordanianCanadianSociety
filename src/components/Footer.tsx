import Link from 'next/link';
import './footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer arabesque-border" id="main-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: About */}
          <div className="footer-col">
            <div className="footer-logo">
              <span className="logo-icon">✦</span>
              <span className="logo-title">JCS</span>
            </div>
            <p className="footer-about">
              Bridging Jordanian heritage with Canadian community.
              Building connections, celebrating culture, creating home.
            </p>
            <p className="footer-arabic text-arabic">
              الجمعية الأردنية الكندية
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">Quick Links</h3>
            <nav className="footer-links">
              <Link href="/" id="footer-home">Home</Link>
              <Link href="/events" id="footer-events">Events</Link>
              <Link href="/about" id="footer-about">About Us</Link>
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div className="footer-col">
            <h3 className="footer-heading">Get in Touch</h3>
            <div className="footer-contact">
              <p>📧 info@jordaniancanadian.ca</p>
              <p>📍 Sheppards run, Beechville, B3T 2G6</p>
            </div>
          </div>
        </div>

        <div className="arabesque-divider" style={{ margin: 'var(--space-xl) 0' }} />

        <div className="footer-bottom">
          <p>© {currentYear} Jordanian Canadian Society. All rights reserved.</p>
          <p className="footer-tagline text-arabic">معاً نبني جسوراً بين الثقافات</p>
        </div>
      </div>
    </footer>
  );
}
