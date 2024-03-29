/* eslint-disable import/prefer-default-export,no-undef-init */

import { useEffect, useRef, useState } from 'react';

import { getScrollbarWidth } from 'utils/ui';

const listeners = [];

let width = undefined;
let prevWidth = undefined;

function onResize() {
  const scrollbarWidth = getScrollbarWidth();

  if (scrollbarWidth === 0) {
    width = null;
  } else {
    width = window.innerWidth - scrollbarWidth;
  }

  if (width !== prevWidth) {
    for (const callback of listeners) {
      callback(width);
    }
  }

  prevWidth = width;
}

export default function useWidthWithoutScrollbar() {
  const [value, setValue] = useState(width);
  const currentRef = useRef(null);
  currentRef.current = value;

  useEffect(() => {
    if (listeners.length === 0) {
      window.addEventListener('resize', onResize);
    }

    listeners.push(setValue);

    if (width === undefined) {
      onResize();
    } else if (currentRef.current !== width) {
      setValue(width);
    }

    return () => {
      const index = listeners.lastIndexOf(setValue);

      if (index !== -1) {
        listeners.splice(index, 1);
      }

      if (listeners.length === 0) {
        window.removeEventListener('resize', onResize);
      }
    };
  }, []);

  return value;
}
