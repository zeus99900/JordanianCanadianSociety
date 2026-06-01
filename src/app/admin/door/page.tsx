import type { Metadata } from 'next';
import AdminDoor from './AdminDoor';

export const metadata: Metadata = {
  title: 'Door Check-In',
  robots: { index: false, follow: false },
};

export default function AdminDoorPage() {
  return <AdminDoor />;
}
