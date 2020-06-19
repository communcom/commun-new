/* eslint-disable no-shadow */

import React from 'react';
import PropTypes from 'prop-types';
import by from 'styled-by';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

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

  ${by('type', {
    mention: `background-color: #62c6ff;`,
    reply: `background-color: #ff9a62;`,
  })}
`;

const IconStyled = styled(Icon)`
  display: block;
  color: #fff;
`;

const NOTIFY_ICON_TYPES = {
  upvote: {
    icon: 'notif-upvote',
    size: 14,
  },
  mention: {
    icon: 'notif-mention',
    color: '#62c6ff',
    size: 12,
  },
  reply: {
    icon: 'notif-reply',
    size: 16,
  },
  reward: {
    icon: 'notif-reward',
    size: 12,
  },
};

export default function NotificationTypeIcon({ type, className }) {
  const info = NOTIFY_ICON_TYPES[type];

  if (!info) {
    return null;
  }

  return (
    <Wrapper className={className}>
      <InnerCircle type={type}>
        <IconStyled name={info.icon} size={info.size} />
      </InnerCircle>
    </Wrapper>
  );
}

NotificationTypeIcon.propTypes = {
  type: PropTypes.string.isRequired,
};
