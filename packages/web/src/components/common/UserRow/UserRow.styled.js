import styled from 'styled-components';
import is from 'styled-is';

import { Button, styles, up } from '@commun/ui';
import { Icon } from '@commun/icons';

import Avatar from 'components/common/Avatar';

export const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;

  ${up.tablet} {
    padding: 0;
    padding-bottom: 20px;
    background-color: unset;
  }
`;

export const ItemText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  max-width: calc(100% - 130px);
  margin: 0 10px;

  ${is('isFollowed')`
    max-width: calc(100% - 90px);
  `};

  ${is('isBlacklist')`
    max-width: calc(100% - 94px);
  `};
`;

export const ItemNameLink = styled.a`
  display: block;
  max-width: min-content;
  margin-bottom: 3px;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  color: #000;
  ${styles.overflowEllipsis};

  ${up.tablet} {
    margin-bottom: 2px;
    font-size: 14px;
    line-height: 19px;
  }
`;

export const StatsWrapper = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.colors.gray};

  ${up.tablet} {
    line-height: 16px;
  }
`;

export const StatsItem = styled.p`
  text-transform: capitalize;
  ${styles.overflowEllipsis};

  ${is('isSeparator')`
    padding: 0 5px;
  `}
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

export const FollowButton = styled(Button).attrs({ type: 'button', primary: true })`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 60px;
  max-width: 60px;
  border-radius: 30px;
  transition: background-color 0.15s;
  cursor: pointer;

  ${up.tablet} {
    min-width: 70px;
    max-width: unset;
  }
`;

export const UnblockButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 10px 10px;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.red};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.lightRed};
  }
`;

export const UnblockIcon = styled(Icon).attrs({ name: 'unblock' })`
  width: 24px;
  height: 24px;
`;

export const AvatarStyled = styled(Avatar)`
  width: 50px;
  height: 50px;
`;

export const MoreActions = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 10px 10px;
  border-radius: 48px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

export const MoreIcon = styled(Icon).attrs({ name: 'more-right' })`
  width: 20px;
  height: 20px;
  color: #000000;

  ${is('isBig')`
    width: 40px;
    height: 40px;
  `};
`;
