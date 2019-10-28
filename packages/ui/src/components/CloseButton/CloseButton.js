import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

const Button = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 20px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const CloseIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 12px;
  height: 12px;
`;

const BackIcon = styled(Icon).attrs({ name: 'dropdown' })`
  width: 20px;
  height: 20px;
  transform: rotate(90deg);
`;

export default function CloseButton(props) {
  const { isBack } = props;
  return <Button {...props}>{isBack ? <BackIcon /> : <CloseIcon />}</Button>;
}

CloseButton.propTypes = {
  isBack: PropTypes.bool,
};

CloseButton.defaultProps = {
  isBack: false,
};
