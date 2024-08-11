import { auth } from '@/lib/auth';
import AuthButton from './AuthButton.server';

export const metadata = {
  title: 'Main Page',
};

export default async function MainPage() {
  const session = await auth();

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <AuthButton />
    </div>
  );
}
