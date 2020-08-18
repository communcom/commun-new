import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { Icon } from '@commun/icons';
import { Button, styles, up } from '@commun/ui';

import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';

export const WidgetCard = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 15px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.white};

  ${isNot('noPadding')`
    & > :last-child {
      padding-bottom: 20px;
    }

    & > :only-child {
      padding-bottom: 15px;
    }
  `};

  ${up.tablet} {
    width: ${RIGHT_SIDE_BAR_WIDTH}px;
  }
`;

export const WidgetTitle = styled.h4`
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.black};
`;

export const WidgetList = styled.ul``;

export const WidgetItem = styled.li`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    padding-bottom: 15px;
  }
`;

export const WidgetItemText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  margin-left: 10px;
  overflow: hidden;
`;

export const WidgetNameLink = styled.a`
  display: block;
  margin-bottom: 2px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.black};

  ${styles.overflowEllipsis};
`;

export const StatsWrapper = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
  cursor: default;
`;

export const StatsItem = styled.p`
  text-transform: capitalize;
  ${styles.overflowEllipsis};

  ${is('isSeparator')`
    padding: 0 5px;
  `}

  ${is('isBlue')`
    color: ${({ theme }) => theme.colors.blue};
  `}
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
`;

export const FollowButton = styled(Button).attrs({ type: 'button', hollow: true, blue: true })`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 48px;
  transition: background-color 0.15s;
  cursor: pointer;
`;

export const MoreActions = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  padding-right: 0;
  border-radius: 48px;
  color: ${({ theme }) => theme.colors.black};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

export const MoreIcon = styled(Icon).attrs({ name: 'more' })`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const Cover = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 130px;
  border-radius: 10px 10px 0 0;

  background: ${({ theme }) => theme.colors.blue};
  background: linear-gradient(120.28deg, ${({ theme }) => theme.colors.blue} 0.62%, #90a0f8 100%);

  ${is('isBig')`
    align-items: center;
    height: 232px;
    padding: 0 20px;
  `};
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 130px 0 15px;

  ${is('isBig')`
    margin: 0;
  `};
`;

export const Title = styled.h4`
  font-weight: bold;
  font-size: 17px;
  line-height: 23px;
  color: #fff;

  ${is('isBig')`
    font-size: 22px;
    line-height: 30px;
  `};
`;

export const Description = styled.p`
  padding-top: 6px;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.7);

  ${is('isBig')`
    padding-top: 5px;
    font-size: 15px;
    line-height: 22px;
  `};
`;

export const Phone = styled.img.attrs({ alt: '' })`
  position: absolute;
  right: 0;
  max-height: 100%;
  width: auto;

  ${is('isBig')`
    position: static;
    width: 201px;
  `};
`;

export const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 19px 15px;
  height: 74px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0 0 10px 10px;

  ${is('isBig')`
    padding: 20px 30px;
  `};
`;

export const IconGetPointsWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #788cf7;
`;

export const IconGetPoints = styled(Icon).attrs({ name: 'wallet' })`
  display: block;
  width: 24px;
  height: 24px;
  color: #fff;
`;
