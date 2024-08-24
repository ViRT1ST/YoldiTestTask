import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Yoldi Profile Page',
};

interface RedirectToProfileProps {
  searchParams?: {
    error?: string;
    code?: string;
  } | null | undefined;
}

export default function RedirectToProfile({ searchParams }: RedirectToProfileProps) {
  const error = searchParams?.error;
  const code = searchParams?.code;

  const redirectUrl = error && code
    ? `/yoldi/profile/me?error=${error}&code=${code}`
    : `/yoldi/profile/me`;
  
  redirect(redirectUrl);
}
