import { useLayoutEffect } from 'react';

let scrollLock = 0;

export default function useWindowScrollLock() {
  useLayoutEffect(() => {
    if (scrollLock === 0) {
      document.body.style.overflow = 'hidden';
    }

    scrollLock += 1;

    return () => {
      if (scrollLock > 0) {
        scrollLock -= 1;
      }

      if (scrollLock === 0) {
        document.body.style.overflow = '';
      }
    };
  }, []);
}
