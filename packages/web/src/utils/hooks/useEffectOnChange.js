import { useEffect, useRef } from 'react';

export default function useEffectOnChange(callback, deps) {
  const isFirstRef = useRef(true);
  const callbackRef = useRef(null);

  callbackRef.current = callback;

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isFirstRef.current) {
      isFirstRef.current = false;
    } else {
      return callbackRef.current();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
