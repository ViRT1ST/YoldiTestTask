import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Main Page',
};

export default function MainPage() {
  redirect('/yoldi/profile/me');
}
