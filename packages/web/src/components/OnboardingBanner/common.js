import styled, { keyframes } from 'styled-components';
import is from 'styled-is';

import { Button, animations, up } from '@commun/ui';
import { Icon } from '@commun/icons';

const moveLeftOnUnmount = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50px);
  }
`;

const moveLeftOnMount = keyframes`
  from {
    transform: translateX(100px);
  }

  to {
    transform: translateX(0);
  }
`;

export const Wrapper = styled.section`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 432px;
  will-change: opacity;

  ${is('isMountAnimationStarted')`
    animation: 0.75s linear ${animations.fadeIn};
  `};

  ${is('isUnmountAnimationStarted')`
    animation: 0.5s linear ${animations.fadeOut};
  `};

  ${up.tablet} {
    align-items: center;
  }

  ${up.desktop} {
    align-items: flex-start;
  }
`;

export const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  will-change: transform;

  ${is('isMountAnimationStarted')`
    animation: 0.75s linear ${moveLeftOnMount};
  `};

  ${is('isUnmountAnimationStarted')`
    animation: 0.5s linear ${moveLeftOnUnmount};
  `};
`;

export const Image = styled.img`
  position: relative;
  flex-shrink: 0;
  width: 364px;
  z-index: 2;

  ${up.tablet} {
    max-width: 250px;
    margin-left: 8px;

    @media (min-width: 850px) {
      max-width: 280px;
    }
  }

  ${up.desktop} {
    max-width: unset;
    margin: 18px 38px;

    @media (max-width: 1150px) {
      max-width: 364px;
    }
  }
`;

export const Title = styled.h1`
  max-width: 624px;
  font-family: 'Montserrat', Arial, sans-serif;
  font-weight: bold;
  line-height: 1;
  letter-spacing: -3px;

  ${up.tablet} {
    margin-bottom: 32px;
    font-size: 36px;
  }

  ${up.desktop} {
    margin: 72px 0 32px;
    font-size: 54px;

    @media (max-width: 1150px) {
      font-size: 48px;
    }
  }
`;

export const Description = styled.p`
  max-width: 532px;
  margin-bottom: 40px;
  font-size: 18px;
  line-height: 25px;

  @media (max-width: 1150px) {
    font-size: 16px;
    line-height: 20px;
  }
`;

export const ButtonStyled = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 341px;
  height: 60px;
  padding: 0;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
`;

export const CoinIcon = styled(Icon).attrs({ name: 'reward' })`
  width: 32px;
  height: 32px;
  margin-left: 16px;
`;
