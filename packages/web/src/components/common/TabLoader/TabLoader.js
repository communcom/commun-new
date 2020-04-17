import React from 'react';
import styled from 'styled-components';

import { SplashLoader } from '@commun/ui';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 280px;
  margin-bottom: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.white};
`;

export default function TabLoader() {
  return (
    <Wrapper>
      <SplashLoader noShadow isStatic />
    </Wrapper>
  );
}
