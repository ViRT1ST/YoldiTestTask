import { headers } from 'next/headers';

export default async function WhoAmIRSC() {
  const { user } = await fetch('http://localhost:3000/api/debug', {
    method: 'GET',
    headers: headers(),
  }).then((res) => res.json());

  return (
    <div>Who Am I (RSC): {user?.name}</div>
  );
}
