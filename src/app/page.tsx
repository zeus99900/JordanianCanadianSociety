import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import HeroBanner from '@/components/HeroBanner';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import type { Event } from '@/lib/types';
import './home.css';

async function getNextEvent(): Promise<Event | null> {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(1)
    .single();
  return data;
}

export default async function HomePage() {
  const nextEvent = await getNextEvent();

  return (
    <div className="page-enter">
      {nextEvent && <AnnouncementBanner event={nextEvent} />}
      <HeroBanner />

      {/* Info Cards Section */}
      <section className="section info-section pattern-bg" id="info-section">
        <div className="container">
          <div className="info-header">
            <p className="info-arabic text-arabic-display">معاً نبني مجتمعاً</p>
            <h2 className="section-title">Welcome to Our Community</h2>
            <p className="section-subtitle">
              We bring together Jordanians and friends of Jordan across Canada
              to celebrate our shared heritage and build lasting connections.
            </p>
          </div>

          <div className="arabesque-divider" style={{ maxWidth: '300px', margin: '2rem auto' }} />

          <div className="grid-cards info-cards">
            <div className="info-card card animate-fade-in-up stagger-1" id="card-mission">
              <div className="card-body">
                <div className="info-card-icon">🌙</div>
                <h3 className="info-card-title">Our Mission</h3>
                <p className="info-card-text">
                  To preserve Jordanian culture and traditions while fostering
                  integration and mutual understanding within the Canadian mosaic.
                </p>
              </div>
            </div>

            <div className="info-card card animate-fade-in-up stagger-2" id="card-events">
              <div className="card-body">
                <div className="info-card-icon">🎊</div>
                <h3 className="info-card-title">Events & Gatherings</h3>
                <p className="info-card-text">
                  From cultural celebrations and traditional dinners to community
                  picnics and educational workshops — there&apos;s always something happening.
                </p>
                <Link href="/events" className="btn btn-primary btn-sm" style={{ marginTop: 'auto' }}>
                  View Events →
                </Link>
              </div>
            </div>

            <div className="info-card card animate-fade-in-up stagger-3" id="card-join">
              <div className="card-body">
                <div className="info-card-icon">🤝</div>
                <h3 className="info-card-title">Join Us</h3>
                <p className="info-card-text">
                  Whether you&apos;re Jordanian, of Jordanian descent, or simply a friend
                  of Jordan — you&apos;re welcome here. Come be part of our family.
                </p>
                <Link href="/about" className="btn btn-outline btn-sm" style={{ marginTop: 'auto' }}>
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Highlight Section */}
      <section className="section culture-section" id="culture-section">
        <div className="container">
          <div className="culture-grid">
            <div className="culture-content">
              <p className="culture-arabic text-arabic-display">تراثنا فخرنا</p>
              <h2 className="section-title">Our Heritage, Our Pride</h2>
              <p className="culture-text">
                From the ancient city of Petra to the vibrant streets of Amman,
                Jordanian culture is rich with hospitality, artistry, and
                resilience. We carry these values with us as we build our
                community in Canada.
              </p>
              <div className="culture-stats">
                <div className="stat">
                  <span className="stat-number">🇯🇴</span>
                  <span className="stat-label">Jordanian Heritage</span>
                </div>
                <div className="stat">
                  <span className="stat-number">🇨🇦</span>
                  <span className="stat-label">Canadian Home</span>
                </div>
                <div className="stat">
                  <span className="stat-number">❤️</span>
                  <span className="stat-label">One Community</span>
                </div>
              </div>
            </div>
            <div className="culture-visual">
              <div className="culture-pattern gradient-heritage pattern-bg">
                <div className="culture-emblem">
                  <span className="emblem-text text-arabic-display">الأردن</span>
                  <span className="emblem-sub">Jordan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
