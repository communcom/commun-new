import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, CloseButton, up } from '@commun/ui';
import OnboardingCarouselDots from 'components/common/OnboardingCarouselDots';
import OnboardingCarousel from 'components/common/OnboardingCarousel/';
import Welcome from 'components/modals/OnboardingWelcome/Welcome';
import AllInOne from 'components/modals/OnboardingWelcome/AllInOne';
import Monetize from 'components/modals/OnboardingWelcome/Monetize';
import Owned from 'components/modals/OnboardingWelcome/Owned';

export const Wrapper = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 480px;
  height: 100vh;
  background-color: #fff;
  overflow: hidden;

  ${up.mobileLandscape} {
    border-radius: 20px;
    box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.05);
  }

  ${up.tablet} {
    height: 618px;
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
  z-index: 1;
`;

const CloseButtonStyled = styled(CloseButton)`
  width: 30px;
  height: 30px;
`;

const OnboardingWelcome = ({ openLoginModal, close }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  async function onClickSignIn() {
    await close();
    openLoginModal();
  }

  function onChangeActive(index) {
    setActiveIndex(index);
  }

  return (
    <Wrapper>
      <Content>
        <Header>
          {activeIndex === 4 ? null : (
            <Left>
              <SignIn onClick={onClickSignIn}>Sign in</SignIn>
            </Left>
          )}
          <OnboardingCarouselDots
            count={4}
            activeIndex={activeIndex}
            onChangeActive={onChangeActive}
          />
          <Right>
            <CloseButtonStyled onClick={close} />
          </Right>
        </Header>
        <OnboardingCarousel activeIndex={activeIndex} onChangeActive={onChangeActive}>
          <Welcome />
          <AllInOne />
          <Monetize />
          <Owned close={close} />
        </OnboardingCarousel>
      </Content>
    </Wrapper>
  );
};

OnboardingWelcome.propTypes = {
  openLoginModal: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default OnboardingWelcome;
