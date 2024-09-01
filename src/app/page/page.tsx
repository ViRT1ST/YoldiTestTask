import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Yoldi Main Page',
};

export default function MainPage() {
  redirect('/page/accounts');
}
