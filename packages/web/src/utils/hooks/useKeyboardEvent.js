import { useEffect, useContext } from 'react';
import isHotkey from 'is-hotkey';

import { KeyBusContext } from 'utils/keyBus';

export default function useKeyboardEvent(key, callback) {
  const keyBus = useContext(KeyBusContext);

  useEffect(() => {
    const handler = event => {
      if (typeof key === 'function' && key(event)) {
        callback();
      } else if (typeof key === 'string' && isHotkey(key, event)) {
        callback();
      }
    };

    keyBus.on(handler);

    return () => {
      keyBus.off(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
