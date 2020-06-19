import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';

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
  color: ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  cursor: pointer;
  transition: color 0.15s;

  ${is('isAvatar')`
    width: 21px;
    height: 21px;
    border: 1px solid ${({ theme }) => theme.colors.white};
  `};
`;

const UploadIcon = styled(Icon).attrs({ name: 'photo-solid' })`
  width: 18px;
  height: 18px;

  ${is('isAvatar')`
    width: 11px;
    height: 10px;
  `};
`;

function UploadButton({ isAvatar, title, className, ...props }) {
  return (
    <Wrapper
      isAvatar={isAvatar}
      name="upload-new-avatar"
      title={title || 'Upload new image'}
      className={className}
      {...props}
    >
      <UploadIcon isAvatar={isAvatar} />
    </Wrapper>
  );
}

// fix for https://www.styled-components.com/docs/advanced#referring-to-other-components
export default styled(UploadButton)``;

UploadButton.propTypes = {
  isAvatar: PropTypes.bool,
  title: PropTypes.string,
};

UploadButton.defaultProps = {
  isAvatar: false,
  title: undefined,
};
