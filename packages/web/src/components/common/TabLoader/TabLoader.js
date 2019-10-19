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
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  border-radius: 4px;
  background-color: #fff;
`;

const LoaderStyled = styled(Loader)`
  svg {
    width: 100px;
    height: 100px;
    color: ${({ theme }) => theme.colors.contextBlue};
  }
`;

export default function TabLoader() {
  return (
    <Wrapper>
      <LoaderStyled />
    </Wrapper>
  );
}