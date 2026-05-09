import { useEffect, useState } from 'react';

export function useStaggeredReveal(delay = 120) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setReady(true), delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay]);

  return ready;
}