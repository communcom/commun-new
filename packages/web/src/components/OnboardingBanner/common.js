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
  position: relative;
  display: flex;
  perspective: 1000;
  backface-visibility: hidden;
  will-change: opacity;

  ${is('isMountAnimationStarted')`
    animation: 0.75s linear ${animations.fadeIn};
  `};

  ${is('isUnmountAnimationStarted')`
    animation: 0.5s linear ${animations.fadeOut};
  `};

  ${up.tablet} {
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 432px;
    padding: 0;
  }

  ${up.desktop} {
    align-items: flex-start;
  }
`;

export const RightWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  perspective: 1000;
  backface-visibility: hidden;
  will-change: transform;

  ${is('isMountAnimationStarted')`
    animation: 0.75s linear ${moveLeftOnMount};
  `};

  ${is('isUnmountAnimationStarted')`
    animation: 0.5s linear ${moveLeftOnUnmount};
  `};

  ${up.tablet} {
    z-index: 1;
  }
`;

export const Image = styled.img`
  position: absolute;
  top: -25px;
  right: -20px;
  flex-shrink: 0;
  height: 256px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5, visibility 0.5;

  ${is('isActive')`
    opacity: 1;
    visibility: visible;
  `};

  ${up.tablet} {
    top: 0;
    z-index: 2;
    width: 364px;
    height: auto;
    max-width: 250px;
    margin-left: 8px;

    @media (min-width: 850px) {
      max-width: 280px;
    }

    ${is('isActive')`
      position: relative;
      opacity: 1;
      visibility: visible;
    `};
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
  min-height: 265px;
  padding-bottom: 32px;
  font-family: 'Montserrat', Arial, sans-serif;
  font-weight: bold;
  font-size: 46px;
  line-height: 44px;
  letter-spacing: -3px;
  user-select: none;

  br {
    line-height: 44px;
  }

  ${up.tablet} {
    position: static;
    z-index: 1;
    height: auto;
    min-height: unset;
    padding-bottom: 0;
    margin-bottom: 32px;
    font-size: 36px;
    line-height: 1;
    user-select: unset;

    br {
      line-height: 1em;
    }
  }

  ${up.desktop} {
    max-width: 624px;
    margin: 72px 0 32px;
    font-size: 54px;

    @media (max-width: 1150px) {
      font-size: 48px;
    }
  }
`;

export const HighlightedWord = styled.span`
  line-height: 1;
  color: ${({ theme }) => theme.colors.blue};
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
  width: 100%;
  height: 60px;
  padding: 0;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;

  ${up.tablet} {
    width: 340px;
  }
`;

export const MobileAppLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  border-radius: 100px;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.blue};
`;

export const CoinIcon = styled(Icon).attrs({ name: 'reward' })`
  width: 32px;
  height: 32px;
  margin-left: 16px;
`;

export const TextButton = styled.button.attrs({ type: 'button' })`
  margin-top: 30px;
  padding-bottom: 20px;
  font-weight: bold;
  font-size: 18px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
`;
