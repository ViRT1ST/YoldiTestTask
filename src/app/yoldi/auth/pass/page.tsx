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

  // Auto submit form
  return (
    <div className="p-4 invisible">
      <form ref={autoSubmitForm} name="autoSubmit" action={authorizeUser}>
        <button type="submit">Update Session</button>
      </form>
    </div>
  );
}

