import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { SplashLoader } from '@commun/ui';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 280px;
  margin-bottom: 8px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.white};
`;

function TabLoader(props, ref) {
  return (
    <Wrapper ref={ref}>
      <SplashLoader noShadow isStatic />
    </Wrapper>
  );
}

export default forwardRef(TabLoader);
