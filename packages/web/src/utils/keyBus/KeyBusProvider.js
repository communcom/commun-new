/* eslint-disable react-hooks/exhaustive-deps */

import React, { useMemo, useEffect } from 'react';

import Context from './Context';
import KeyBus from './KeyBus';

export default function KeyBusProvider({ children }) {
  const keyBus = useMemo(() => new KeyBus(), []);

  const value = useMemo(
    () => ({
      on: keyBus.on,
      off: keyBus.off,
    }),
    []
  );

  useEffect(
    () => () => {
      keyBus.destroy();
    },
    []
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
