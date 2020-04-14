import React from 'react';
import styled from 'styled-components';

import { Loader } from '@commun/ui';

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

const LoaderStyled = styled(Loader)`
  svg {
    width: 100px;
    height: 100px;
    color: ${({ theme }) => theme.colors.blue};
  }
`;

export default function TabLoader() {
  return (
    <Wrapper>
      <LoaderStyled />
    </Wrapper>
  );
}
