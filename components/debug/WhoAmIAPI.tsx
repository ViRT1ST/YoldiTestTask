'use client';

import { useEffect, useState } from 'react';

export default function WhoAmIAPI() {
  const [user, setUser] = useState(null);
  // console.log(user);

  useEffect(() => {
    fetch('/api/debug')
      .then((res) => res.json())
      .then(({ user }) => setUser(user?.name || user?.profile_name));
  }, []);
  
  return <div>Who Am I (client): {user}</div>;
}
