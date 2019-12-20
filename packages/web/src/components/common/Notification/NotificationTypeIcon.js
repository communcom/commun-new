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
  },
  mention: {
    icon: 'notif-mention',
    color: '#62c6ff',
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
  display: block;
  width: 20px;
  height: 20px;
  padding: 3px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.blue};
`;

const IconStyled = styled(Icon)`
  display: block;
  width: 14px;
  height: 14px;
`;

export default function NotificationTypeIcon({ type }) {
  const info = ICON_TYPES[type];

  if (!info) {
    return null;
  }

  return (
    <Wrapper>
      <InnerCircle
        type={type}
        style={{
          backgroundColor: info.color,
        }}
      >
        <IconStyled name={info.icon} />
      </InnerCircle>
    </Wrapper>
  );
}

NotificationTypeIcon.propTypes = {
  type: PropTypes.string.isRequired,
};
