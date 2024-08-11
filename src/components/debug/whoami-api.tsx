'use client';

import { useEffect, useState } from 'react';
// import * as constants from '@/constants';

export default function WhoAmIAPI() {
  const [user, setUser] = useState(null);
  // console.log(user);
  
  // console.log(constants.API_AUTH_BASE_PATH);

  useEffect(() => {
    fetch('/api/debug')
      .then((res) => res.json())
      .then(({ user }) => setUser(user?.name || user?.profile_name));
  }, []);
  
  return <div>Who Am I (client): {user}</div>;
}
