import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Portfolio Main Page',
};

export default function MainPage() {
  redirect('/debug');
}
