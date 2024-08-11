'use client';

import { useEffect, useState } from 'react';

export default function WhoAmIAPI() {
  const [user, setUser] = useState(null);
  // console.log(user);

  useEffect(() => {
    fetch('/api/whoami')
      .then((res) => res.json())
      .then(({ user }) => setUser(user.name));
  }, []);
  
  return <div className="mt-5">Who Am I (client): {user}</div>;
}
