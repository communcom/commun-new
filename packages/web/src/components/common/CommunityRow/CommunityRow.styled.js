import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { Button, styles, up } from '@commun/ui';
import { Icon } from '@commun/icons';

import Avatar from 'components/common/Avatar';

export const Item = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 20px;
`;

export const ItemText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  margin-left: 10px;
`;

export const ItemNameLink = styled.a`
  display: block;
  margin-bottom: 2px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  ${styles.overflowEllipsis};
  color: #000;

  ${isNot('isOnboarding')`
    ${up.tablet} {
      font-size: 16px;
      line-height: 22px;
    }
  `};
`;

export const StatsWrapper = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const StatsItem = styled.p`
  text-transform: capitalize;
  ${styles.overflowEllipsis};

  ${is('isSeparator')`
    padding: 0 5px;
  `}
`;

export const FollowButton = styled(Button).attrs({ type: 'button', primary: true })`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  transition: background-color 0.15s;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.blueHover};
  }

  ${is('isJoined')`
    &,
    &:disabled,
    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.blue};
      background-color: ${({ theme }) => theme.colors.lightGrayBlue};
    }
  `};
`;

export const AvatarStyled = styled(Avatar)`
  width: 40px;
  height: 40px;

  ${up.tablet} {
    width: 60px;
    height: 60px;

    ${is('isOnboarding')`
      width: 50px;
      height: 50px;
    `};
  }
`;

export const MoreActions = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 48px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

export const MoreIcon = styled(Icon).attrs({ name: 'vertical-more' })`
  width: 20px;
  height: 20px;
  color: #000000;

  ${is('isBig')`
    width: 40px;
    height: 40px;
  `};
`;
