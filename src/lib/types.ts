// ============================================
// TypeScript Interfaces
// ============================================

export interface Event {
  id: string;
  created_at: string;
  title: string;
  title_ar: string | null;
  description: string | null;
  event_date: string;
  location: string | null;
  price_adult_cents: number;
  price_kid_cents: number;
  max_capacity: number | null;
  is_active: boolean;
  image_url: string | null;
  etransfer_email: string | null;
}

export interface Registration {
  id: string;
  created_at: string;
  event_id: string;
  lead_name: string;
  email: string;
  phone: string | null;
  count_men: number;
  count_women: number;
  count_kids: number;
  amount_paid_cents: number;
  payment_method: 'stripe' | 'cash_at_door' | 'e_transfer';
  stripe_intent_id: string | null;
  is_paid: boolean;
  is_checked_in: boolean;
  checked_in_at: string | null;
}

export interface RegistrationWithEvent extends Registration {
  events?: Event;
}

export interface CheckInResult {
  status: 'success' | 'already_checked_in' | 'not_found' | 'not_paid' | 'error';
  registration?: Registration;
  message: string;
}

export interface AdminAuthResponse {
  success: boolean;
  error?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
}

export interface CreateRegistrationPayload {
  eventId: string;
  leadName: string;
  email: string;
  phone?: string;
  countMen: number;
  countWomen: number;
  countKids: number;
  stripeIntentId?: string;
  paymentMethod: 'stripe' | 'cash_at_door' | 'e_transfer';
  amountPaidCents: number;
}

export interface MetricsData {
  totalRevenue: number;
  expectedMen: number;
  expectedWomen: number;
  expectedKids: number;
  totalExpected: number;
  checkedIn: number;
  totalRegistrations: number;
  paidCount: number;
  unpaidCount: number;
}
