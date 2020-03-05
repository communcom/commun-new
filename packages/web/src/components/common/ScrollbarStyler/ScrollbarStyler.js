import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { useWidthWithoutScrollbar } from 'utils/hooks';

const ScrollbarStyle = createGlobalStyle`
  #__next {
    & ::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
    }

    & ::-webkit-scrollbar-track {
      background: none;
    }

    & ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, .2);
    }
  }
`;

export default function ScrollbarStyler() {
  const width = useWidthWithoutScrollbar();

  if (width > 0) {
    return <ScrollbarStyle />;
  }

  return null;
}
