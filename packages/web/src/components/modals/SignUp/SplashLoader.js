import React from 'react';
import styled from 'styled-components';

import { SplashLoader } from '@commun/ui';

const Wrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
`;

export default () => (
  <Wrapper>
    <SplashLoader />
  </Wrapper>
);
