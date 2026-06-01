import type { Metadata } from 'next';
import './about.css';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the Jordanian Canadian Nashama Society — our mission, history, and the people who make our community thrive.',
};

export default function AboutPage() {
  return (
    <div className="page-enter">
      {/* About Hero */}
      <section className="about-hero gradient-heritage pattern-bg" id="about-hero">
        <div className="container about-hero-content">
          <p className="about-hero-arabic text-arabic-display">من نحن</p>
          <h1 className="about-hero-title">About Us</h1>
          <p className="about-hero-subtitle">
            The story of our community — from roots in Jordan to our home in Canada.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section" id="mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <p className="mission-arabic text-arabic-display">مهمتنا</p>
              <h2 className="section-title">Our Mission</h2>
              <p className="mission-text">
                The Jordanian Canadian Nashama Society (JCNS) is a community-driven organization
                dedicated to preserving and sharing the rich cultural heritage of Jordan
                while fostering meaningful connections within the Canadian multicultural landscape.
              </p>
              <p className="mission-text">
                Founded by a group of passionate Jordanian-Canadians, we serve as a bridge
                between two cultures — hosting events, supporting newcomers, and creating a
                sense of home for everyone in our community.
              </p>
            </div>
            <div className="mission-values">
              <div className="value-card animate-fade-in-up stagger-1">
                <span className="value-icon">🌍</span>
                <h3>Heritage</h3>
                <p>Preserving Jordanian culture, traditions, and language for future generations</p>
              </div>
              <div className="value-card animate-fade-in-up stagger-2">
                <span className="value-icon">🤝</span>
                <h3>Community</h3>
                <p>Building a supportive network of families and individuals across Canada</p>
              </div>
              <div className="value-card animate-fade-in-up stagger-3">
                <span className="value-icon">🌉</span>
                <h3>Integration</h3>
                <p>Helping newcomers settle and thrive in Canadian society</p>
              </div>
              <div className="value-card animate-fade-in-up stagger-4">
                <span className="value-icon">🎓</span>
                <h3>Education</h3>
                <p>Promoting cultural exchange and mutual understanding</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="arabesque-divider" />
      </div>

      {/* Timeline Section */}
      <section className="section timeline-section" id="timeline">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
            <p className="timeline-arabic text-arabic-display">رحلتنا</p>
            <h2 className="section-title">Our Journey</h2>
          </div>

          <div className="timeline">
            <div className="timeline-item animate-fade-in-up">
              <div className="timeline-dot" />
              <div className="timeline-content card">
                <div className="card-body">
                  <span className="timeline-year">Foundation</span>
                  <h3>Community Established</h3>
                  <p>
                    A small group of Jordanian families in Halifax came together
                    with a shared vision of preserving their heritage while
                    building a new home in Canada.
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline-item animate-fade-in-up stagger-1">
              <div className="timeline-dot" />
              <div className="timeline-content card">
                <div className="card-body">
                  <span className="timeline-year">Growth</span>
                  <h3>First Cultural Events</h3>
                  <p>
                    Our first community dinner brought together over 50 families.
                    We began organizing regular events including cultural celebrations,
                    holiday gatherings, and community picnics.
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline-item animate-fade-in-up stagger-2">
              <div className="timeline-dot" />
              <div className="timeline-content card">
                <div className="card-body">
                  <span className="timeline-year">Today</span>
                  <h3>Growing Strong</h3>
                  <p>
                    Today, the JCS continues to grow, welcoming new members and
                    expanding our programs. We&apos;re building something special —
                    a home away from home for all Jordanian-Canadians.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section contact-section" id="contact">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
            <p className="contact-arabic text-arabic-display">تواصل معنا</p>
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Have questions or want to get involved? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-card card">
              <div className="card-body">
                <span className="contact-icon">📧</span>
                <h3>Email Us</h3>
                <p>info@jordaniancanadian.ca</p>
              </div>
            </div>
            <div className="contact-card card">
              <div className="card-body">
                <span className="contact-icon">📍</span>
                <h3>Location</h3>
                <p>
                  Sheppards run<br />
                  Beechville, NS<br />
                  B3T 2G6
                </p>
              </div>
            </div>
            <div className="contact-card card">
              <div className="card-body">
                <span className="contact-icon">🌐</span>
                <h3>Social Media</h3>
                <p>Follow us for updates and community news</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
