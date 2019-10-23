import React from 'react';

import { useWidthWithoutScrollbar } from 'utils/hooks';

export default function ScrollFix(props) {
  const width = useWidthWithoutScrollbar();

  return <div style={width ? { width } : undefined} {...props} />;
}
