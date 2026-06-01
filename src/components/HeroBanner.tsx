import Link from 'next/link';
import './hero-banner.css';

export default function HeroBanner() {
  return (
    <section className="hero gradient-heritage" id="hero-section">
      <div className="hero-flag-triangle">
        <img src="/images/jordan-star.svg" alt="" className="hero-flag-star animate-scale-in" />
      </div>
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-badge animate-fade-in">
          <span className="hero-badge-icon">🇯🇴</span>
          <span>Est. Halifax, Canada</span>
        </div>

        <h1 className="hero-title animate-fade-in-up">
          Jordanian Canadian
          <br />
          <span className="hero-title-accent">Society</span>
        </h1>

        <p className="hero-arabic text-arabic-display animate-fade-in-up stagger-1">
          الجمعية الأردنية الكندية
        </p>

        <p className="hero-subtitle animate-fade-in-up stagger-2">
          Bridging cultures, building community, celebrating heritage
        </p>

        <div className="hero-actions animate-fade-in-up stagger-3">
          <Link href="/events" className="btn btn-gold btn-lg" id="hero-cta-events">
            Upcoming Events
            <span className="btn-arrow">→</span>
          </Link>
          <Link href="/about" className="btn btn-outline hero-btn-outline btn-lg" id="hero-cta-about">
            Learn More
          </Link>
        </div>

        <div className="hero-decorative">
          <div className="hero-line hero-line-1" />
          <div className="hero-diamond">◆</div>
          <div className="hero-line hero-line-2" />
        </div>
      </div>

      <div className="hero-scroll-indicator animate-float">
        <span>↓</span>
      </div>
    </section>
  );
}
