import styled from 'styled-components';

import { Icon } from '@commun/icons';
import React from 'react';

const Wrapper = styled.button.attrs({ type: 'button' })`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  bottom: 0;
  width: 30px;
  height: 30px;
  border-radius: 50px;
  color: ${({ theme }) => theme.colors.contextGrey};
  background-color: ${({ theme }) => theme.colors.contextWhite};
  cursor: pointer;
  transition: color 0.15s;
`;

const UploadIcon = styled(Icon).attrs({ name: 'photo' })`
  width: 18px;
  height: 18px;
`;

function UploadButton({ className }) {
  return (
    <Wrapper name="upload-new-avatar" title="Upload new avatar image" className={className}>
      <UploadIcon />
    </Wrapper>
  );
}

// fix for https://www.styled-components.com/docs/advanced#referring-to-other-components
export default styled(UploadButton)``;
