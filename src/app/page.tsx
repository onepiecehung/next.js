import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to profile page
  redirect('/profile');
}
