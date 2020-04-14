import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Toast } from 'toasts-manager';

import { Icon } from '@commun/icons';

const ToastStyled = styled(Toast)`
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.white};
`;

const ToastIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: ${({ color }) => color};
`;

const ToastText = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px 0 16px;
  flex-grow: 1;
  font-size: 15px;
`;

const CloseButton = styled.button.attrs({ type: 'button' })`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  margin: -10px -12px -10px 0;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.black};
  }
`;

const CloseIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 16px;
  height: 16px;
`;

export default function NotifyToast({ type, text, onClose }) {
  let icon;

  switch (type) {
    case 'info':
      icon = <ToastIcon name="success" color="#4caf50" />;
      break;
    case 'warn':
      icon = <ToastIcon name="warning" color="#ffcb60" />;
      break;
    case 'error':
      icon = <ToastIcon name="warning" color="#ff5959" />;
      break;
    default:
      icon = null;
  }

  return (
    <ToastStyled>
      {icon}
      <ToastText>{text}</ToastText>
      {onClose ? (
        <CloseButton name="notify-toast__close" onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      ) : null}
    </ToastStyled>
  );
}

NotifyToast.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

NotifyToast.defaultProps = {
  onClose: null,
};
