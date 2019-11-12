import React from 'react';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

const Wrapper = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  padding: 4px;
  border-radius: 50px;
  background: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const CloseIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

export default function CloseButton(props) {
  return (
    <Wrapper title="Close" {...props}>
      <CloseIcon />
    </Wrapper>
  );
}
