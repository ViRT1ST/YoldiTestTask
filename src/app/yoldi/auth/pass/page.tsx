'use client';

import { useEffect, useRef } from 'react';
import * as actions from '@/actions';

export default function AuthPassPage() {
  const autoSubmitForm = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (autoSubmitForm.current) {
      autoSubmitForm.current.requestSubmit();
    }
  }, []);

  // Auto submit form
  return (
    <div className="invisible">
      <form ref={autoSubmitForm} name="autoSubmit" action={actions.authorizeUser}>
        <button type="submit">Process User Auth</button>
      </form>
    </div>
  );
}

