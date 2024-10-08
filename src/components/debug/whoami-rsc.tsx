import { headers } from 'next/headers';
import { ROOT_PATH } from '@/config/public';

export default async function WhoAmIRSC() {
  const { user } = await fetch(`${ROOT_PATH}/api/debug`, {
    method: 'GET',
    headers: new Headers(headers())
  }).then((res) => res.json());

  return (
    <div>Who Am I (RSC): {user?.name}</div>
  );
}
