import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import './membership.css';

export default async function MembershipPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let membership: any = null;

  if (user) {
    const { data } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    
    membership = data;
  }

  return (
    <div className="membership-container">
      <div className="membership-hero">
        <h1 className="membership-title">Nashama Annual Membership</h1>
        <p className="membership-subtitle">
          Join the Jordanian Canadian Society as an official member. Your contribution 
          supports our cultural events, community outreach, and helps preserve our 
          heritage in Halifax.
        </p>
      </div>

      <div className="membership-card-wrapper">
        <div className="membership-card">
          {membership ? (
            <>
              <div className="status-badge status-active">✓ Active Member</div>
              <h2 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>
                Thank you for your support!
              </h2>
              <p style={{ color: 'var(--color-gray-400)', marginBottom: '2rem' }}>
                Your membership is valid until {new Date(membership.expires_at).toLocaleDateString()}.
                You will automatically receive $5 off all adult tickets when logged in!
              </p>
              <Link href="/events" className="btn-purchase">
                Browse Upcoming Events
              </Link>
            </>
          ) : (
            <>
              <div className="membership-price">
                $50 <span className="membership-period">/ year</span>
              </div>
              
              <ul className="membership-benefits">
                <li><span className="benefit-icon">✓</span> $5 discount on adult event tickets</li>
                <li><span className="benefit-icon">✓</span> Priority booking for major events</li>
                <li><span className="benefit-icon">✓</span> Voting rights in society meetings</li>
                <li><span className="benefit-icon">✓</span> Exclusive access to members-only gatherings</li>
              </ul>

              {user ? (
                <Link href="/membership/purchase" className="btn-purchase">
                  Become a Member
                </Link>
              ) : (
                <Link href="/auth/login" className="btn-purchase">
                  Log in to Join
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
