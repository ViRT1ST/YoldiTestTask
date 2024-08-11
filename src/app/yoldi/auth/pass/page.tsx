'use client';

import { useEffect, useRef } from 'react';
import { authorizeUser } from '@/actions';

export default function AuthPassPage() {
  const autoSubmitForm = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (autoSubmitForm.current) {
      autoSubmitForm.current.requestSubmit();
    }
  }, []);

  return (
    <div className="p-4">
      {/* <h1>Redirecting to profile...</h1> */}
      <div className="invisible">
        <form ref={autoSubmitForm} name="autoSubmit" action={authorizeUser}>
          <button type="submit">Update Session</button>
        </form>
      </div>
    </div>
  );
}

