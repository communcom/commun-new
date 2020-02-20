import { useLayoutEffect } from 'react';

let scrollElement = null;
let scrollLock = 0;
let lastScrollTop = 0;

if (process.browser) {
  scrollElement = document.scrollingElement || document.documentElement;
}

export default function useWindowScrollLock() {
  useLayoutEffect(() => {
    if (scrollLock === 0) {
      lastScrollTop = scrollElement.scrollTop;
      document.body.style.overflow = 'hidden';
    }

    scrollLock += 1;

    return () => {
      if (scrollLock > 0) {
        scrollLock -= 1;
      }

      if (scrollLock === 0) {
        document.body.style.overflow = '';

        if (scrollElement.scrollTop !== lastScrollTop) {
          scrollElement.scrollTop = lastScrollTop;
        }
      }
    };
  }, []);
}
