import styled from 'styled-components';
import is from 'styled-is';

import { styles, up, Button } from '@commun/ui';
import { Icon } from '@commun/icons';

import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';

export const WidgetCard = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 15px;
  border-radius: 6px;
  background-color: #fff;

  ${up.tablet} {
    width: ${RIGHT_SIDE_BAR_WIDTH}px;
  }
`;

export const WidgetTitle = styled.h4`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.contextBlack};
`;

export const WidgetList = styled.ul``;

export const WidgetItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 15px;
`;

export const WidgetItemText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  margin-left: 10px;
`;

export const WidgetNameLink = styled.a`
  display: block;
  margin-bottom: 2px;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #000;

  ${styles.overflowEllipsis};
`;

export const StatsWrapper = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

export const StatsItem = styled.p`
  text-transform: capitalize;
  ${styles.overflowEllipsis};

  ${is('isSeparator')`
    padding: 0 5px;
  `}

  ${is('isBlue')`
    color: ${({ theme }) => theme.colors.contextBlue};
  `}
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
`;

export const FollowButton = styled(Button).attrs({ type: 'button', primary: 'true' })`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 11px 15px;
  border-radius: 48px;
  transition: background-color 0.15s;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

export const MoreActions = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 48px;
  color: ${({ theme }) => theme.colors.contextBlack};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

export const MoreIcon = styled(Icon).attrs({ name: 'vertical-more' })`
  width: 20px;
  height: 20px;
`;
