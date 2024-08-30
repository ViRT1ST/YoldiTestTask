import { headers } from 'next/headers';

import { ROOT_PATH } from '@/constants/public';

export default async function WhoAmIRSC() {
  const { user } = await fetch(`${ROOT_PATH}/api/debug`, {
    method: 'GET',
    headers: headers(),
  }).then((res) => res.json());

  return (
    <div>Who Am I (RSC): {user?.name}</div>
  );
  return <div>Empty</div>;
}
