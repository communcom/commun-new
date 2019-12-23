import styled from 'styled-components';
import is from 'styled-is';

import { styles, Button, up } from '@commun/ui';

import CoverAvatarOriginal from 'components/common/CoverAvatar';
import DropDownMenuOriginal from 'components/common/DropDownMenu';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: -30px;
  background-color: #fff;

  ${up.desktop} {
    max-height: 340px;
    max-width: 850px;
    margin: 0 auto;
    margin-bottom: 2px;
  }
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 5;
  width: 100%;
  transform: translateY(-30px);
  background-color: #fff;
  border-radius: 30px 30px 0 0;

  ${up.desktop} {
    transform: translateY(0);
    border-radius: 0;
    z-index: initial;
  }
`;

export const InfoWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px;

  ${up.desktop} {
    height: 110px;
    min-height: 110px;
  }
`;

export const CoverAvatar = styled(CoverAvatarOriginal)`
  position: relative;
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #fff;
  z-index: 1;

  ${up.desktop} {
    position: relative;
    top: 0;
    width: 80px;
    height: 80px;
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;

  ${up.desktop} {
    padding: 0 0 0 10px;
  }
`;

export const NameWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  ${up.desktop} {
    padding-bottom: 5px;
  }
`;

export const InfoContainer = styled.div`
  width: 100%;
  padding-left: 10px;

  ${up.desktop} {
    padding-left: 15px;
  }
`;

export const JoinedDate = styled.p`
  padding-bottom: 5px;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const FollowButton = styled(Button)`
  min-width: 73px;
  text-align: center;

  ${up.desktop} {
    min-width: 70px;
  }
`;

export const MoreActions = styled.button.attrs({ type: 'button' })`
  display: none;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 48px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
  transition: color 0.15s;

  ${up.tablet} {
    display: flex;
    color: #000;
    background-color: transparent;

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.blueHover};
    }
  }
`;

export const Name = styled.p`
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  color: #000;

  ${styles.breakWord};

  ${up.desktop} {
    font-size: 30px;
    line-height: 1;
    margin: 0 10px 4px 0;
  }
`;

export const CountersWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: normal;
  padding: 0 15px 15px;
`;

export const CountersLeft = styled.div`
  display: flex;
  flex: 1;
`;

export const CounterField = styled.div`
  display: flex;
  align-items: baseline;
`;

export const CounterValue = styled.div`
  font-weight: bold;
  font-size: 15px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.black};
`;

export const CounterName = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
`;

export const DropDownMenu = styled(DropDownMenuOriginal)`
  ${is('isMobile')`
    position: absolute;
    top: 28px;
    right: 12px;
    z-index: 5;
  `};
`;