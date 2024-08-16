import { headers } from 'next/headers';

export default async function WhoAmIRSC() {
  const { user } = await fetch('http://localhost:3000/api/debug', {
    method: 'GET',
    headers: headers(),
  }).then((res) => res.json());

  const name = user?.db_data?.profile_name || user?.name;

  return (
    <div>Who Am I (RSC): {name}</div>
  );
}
