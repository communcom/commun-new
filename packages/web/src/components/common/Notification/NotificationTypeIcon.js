/* eslint-disable no-shadow */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { theme } from '@commun/ui';
import { Icon } from '@commun/icons';

const ICON_TYPES = {
  upvote: {
    icon: 'notif-upvote',
    color: theme.colors.blue,
    width: 14,
    height: 14,
  },
  mention: {
    icon: 'notif-mention',
    color: '#62c6ff',
    width: 12,
    height: 12,
  },
  reply: {
    icon: 'notif-reply',
    color: '#ff9a62',
    width: 16,
    height: 17,
  },
};

const Wrapper = styled.span`
  position: absolute;
  display: block;
  width: 24px;
  height: 24px;
  right: -2px;
  bottom: -4px;
  padding: 2px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.white};
`;

const InnerCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.blue};
`;

const IconStyled = styled(Icon)`
  display: block;
  width: 14px;
  height: 14px;
`;

export default function NotificationTypeIcon({ type, className }) {
  const info = ICON_TYPES[type];

  if (!info) {
    return null;
  }

  return (
    <Wrapper className={className}>
      <InnerCircle
        type={type}
        style={{
          backgroundColor: info.color,
        }}
      >
        <IconStyled
          name={info.icon}
          style={{
            width: info.width,
            height: info.height,
          }}
        />
      </InnerCircle>
    </Wrapper>
  );
}

NotificationTypeIcon.propTypes = {
  type: PropTypes.string.isRequired,
};
