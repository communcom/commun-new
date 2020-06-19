/* eslint-disable consistent-return */

import { useContext, useEffect, useRef, useState } from 'react';

import { KEY_CODES } from '@commun/ui';

import { isExactKey } from 'utils/keyboard';
import { KeyBusContext } from 'utils/keyBus';

export default function usePopup(panelRef) {
  const elementRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const keyBus = useContext(KeyBusContext);

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
      if (isExactKey(e, KEY_CODES.ESC)) {
        setIsOpen(false);
      }
    }

    window.addEventListener('mousedown', onClick);
    keyBus.on(onKeyDown);

    return () => {
      window.removeEventListener('mousedown', onClick);
      keyBus.off(onKeyDown);
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
