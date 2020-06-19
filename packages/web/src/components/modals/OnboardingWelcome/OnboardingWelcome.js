import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, CloseButton, up } from '@commun/ui';

import { WELCOME_STATE_KEY } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { mergeStateWith } from 'utils/localStore';

import OnboardingCarousel from 'components/common/OnboardingCarousel/';
import OnboardingCarouselDots from 'components/common/OnboardingCarouselDots';
// import Monetize from 'components/modals/OnboardingWelcome/Monetize';
import Owned from 'components/modals/OnboardingWelcome/Owned';
import Thematic from 'components/modals/OnboardingWelcome/Thematic';
import Welcome from 'components/modals/OnboardingWelcome/Welcome';

export const Wrapper = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 480px;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  background-color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  overflow-y: auto;

  ${up.mobileLandscape} {
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
  }

  ${up.tablet} {
    height: 658px;
  }
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 20px 25px 30px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 30px;
  z-index: 1;

  ${up.mobileLandscape} {
    flex-direction: row;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const SignIn = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  cursor: pointer;
`;

const Right = styled.div`
  margin-left: auto;
  z-index: 1;
`;

const CloseButtonStyled = styled(CloseButton)`
  display: none;

  width: 30px;
  height: 30px;

  ${up.mobileLandscape} {
    display: flex;
  }
`;

export default function OnboardingWelcome({ openLoginModal, forceStep, close }) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(forceStep || 0);

  useEffect(() => {
    mergeStateWith(WELCOME_STATE_KEY, {
      lastShownAt: new Date(),
      lastShownStep: activeIndex,
    });
  }, [activeIndex]);

  async function onClickSignIn() {
    await close();
    openLoginModal();
  }

  function onChangeActive(index) {
    setActiveIndex(index);
  }

  const steps = [
    <Welcome key="welcome" />,
    <Thematic key="thematic" />,
    /* <Monetize key="monetize" /> */ <Owned key="owned" close={close} />,
  ];

  return (
    <Wrapper>
      <Content>
        <Header>
          {activeIndex === 2 ? null : (
            <Left>
              <SignIn onClick={onClickSignIn}>{t('common.sign_in')}</SignIn>
            </Left>
          )}
          <OnboardingCarouselDots
            count={steps.length}
            activeIndex={activeIndex}
            onChangeActive={onChangeActive}
          />
          <Right>
            <CloseButtonStyled onClick={close} />
          </Right>
        </Header>
        <OnboardingCarousel activeIndex={activeIndex} onChangeActive={onChangeActive}>
          {steps}
        </OnboardingCarousel>
      </Content>
    </Wrapper>
  );
}

OnboardingWelcome.propTypes = {
  openLoginModal: PropTypes.func.isRequired,
  forceStep: PropTypes.number,
  close: PropTypes.func.isRequired,
};

OnboardingWelcome.defaultProps = {
  forceStep: undefined,
};
