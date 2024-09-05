'use client';

import { useEffect, useState } from 'react';

export default function WhoAmIAPI() {
  const [ name, setName ] = useState(null);

  useEffect(() => {
    fetch('/api/debug')
      .then((res) => res.json())
      .then(({ user }) => {
        setName(user?.name);
      });
  });

  return (
    <div>Who Am I (Client): {name}</div>
  );
}
