import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Yoldi Profile Page',
};

type Props = {
  searchParams?: {
    error?: string;
    code?: string;
  } | null | undefined;
};

export default function RedirectToProfileSlug({ searchParams }: Props) {
  const error = searchParams?.error;
  const code = searchParams?.code;

  const redirectUrl = error && code
    ? `/page/profile/me?error=${error}&code=${code}`
    : `/page/profile/me`;
  
  redirect(redirectUrl);
}
