/* eslint-disable consistent-return */

import { useState, useEffect, useRef } from 'react';

import { KEY_CODES } from '@commun/ui';

export default function(panelRef) {
  const elementRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onClick(e) {
      const ref = panelRef || elementRef;

      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function onKeyDown(e) {
      if (e.which === KEY_CODES.ESC) {
        setIsOpen(false);
      }
    }

    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return {
    isOpen,
    popupRef: elementRef,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
