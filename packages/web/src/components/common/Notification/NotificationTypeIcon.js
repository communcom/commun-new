import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

const ALLOWED_ICONS = ['upvote', 'mention'];

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

  ${({ type }) => (type === 'mention' ? 'background-color: #62c6ff;' : '')};
`;

const IconStyled = styled(Icon)`
  display: block;
  width: 14px;
  height: 14px;
`;

export default function NotificationTypeIcon({ type }) {
  return (
    <Wrapper>
      <InnerCircle type={type}>
        {ALLOWED_ICONS.includes(type) ? <IconStyled name={`notif-${type}`} /> : null}
      </InnerCircle>
    </Wrapper>
  );
}

NotificationTypeIcon.propTypes = {
  type: PropTypes.oneOf(ALLOWED_ICONS).isRequired,
};
