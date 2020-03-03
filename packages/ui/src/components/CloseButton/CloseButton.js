import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

const Button = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  width: 24px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 50%;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const CloseIcon = styled(Icon).attrs({ name: 'close' })`
  ${({ size = 14 } = {}) => `
    width: ${size}px;
    height: ${size}px;
  `};
`;

const BackIcon = styled(Icon).attrs({ name: 'dropdown' })`
  ${({ size = 20 } = {}) => `
    width: ${size}px;
    height: ${size}px;
  `};
  transform: rotate(90deg);
`;

export default function CloseButton(props) {
  const { isBack, size } = props;
  return (
    <Button {...props}>{isBack ? <BackIcon size={size} /> : <CloseIcon size={size} />}</Button>
  );
}

CloseButton.propTypes = {
  isBack: PropTypes.bool,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

CloseButton.defaultProps = {
  isBack: false,
  size: undefined,
};
