import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { Icon } from '@commun/icons';

export const NO_NOTIFICATIONS = 'NO_NOTIFICATIONS';
export const NO_COMMENTS = 'NO_COMMENTS';
export const NO_POINTS = 'NO_POINTS';

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 50vh;
  margin-bottom: 20px;
  padding: 105px 0 140px;
  background-color: #fff;

  ${up('tablet')} {
    min-height: 100%;
    border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
    border-radius: 4px;
  }
`;

const Title = styled.h2`
  margin-top: 20px;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: -0.41px;
  text-align: center;
`;

const Subtitle = styled.p`
  max-width: 288px;
  margin-top: 12px;
  font-size: 17px;
  letter-spacing: -0.41px;
  color: ${({ theme }) => theme.colors.contextGrey};
  text-align: center;
`;

const CustomIcon = styled(Icon)`
  width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

export default function EmptyContentHolder({ type, className }) {
  let iconName = '';
  let title = '';
  let subTitle = '';
  switch (type) {
    case NO_NOTIFICATIONS:
      iconName = 'notifications';
      title = 'No Notifications';
      subTitle = "You haven't got any notifications yet";
      break;
    case NO_COMMENTS:
      iconName = 'chat';
      title = 'No Comments';
      subTitle = "You haven't made any comments yet";
      break;
    case NO_POINTS:
      iconName = 'wallet';
      title = 'Your Wallet is Empty';
      subTitle =
        'Get your first point COMMUN, which can be converted for other points you may want to hold';
      break;
    default:
  }

  return (
    <Wrapper className={className}>
      <CustomIcon name={iconName} />
      <Title>{title}</Title>
      <Subtitle>{subTitle}</Subtitle>
    </Wrapper>
  );
}

EmptyContentHolder.propTypes = {
  type: PropTypes.string.isRequired,
};
