import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import Notification from 'components/common/Notification';

const Wrapper = styled.div`
  position: relative;
  width: 300px;
  padding: 14px 32px 14px 14px;
  border-radius: 10px;
  background-color: #24242c;
`;

const NotificationStyled = styled(Notification)`
  padding: 0;
`;

const CloseButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 6px;
  right: 6px;
`;

const CloseButtonInner = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: 4px;
  border-radius: 50%;
  background-color: #505056;
`;

const CloseIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 12px;
  height: 12px;
  color: #fff;
`;

export default function OnlineNotification({ notificationId, onClose }) {
  return (
    <Wrapper>
      <NotificationStyled notificationId={notificationId} isOnline />
      <CloseButton title="Close" onClick={onClose}>
        <CloseButtonInner>
          <CloseIcon />
        </CloseButtonInner>
      </CloseButton>
    </Wrapper>
  );
}

OnlineNotification.propTypes = {
  notificationId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
