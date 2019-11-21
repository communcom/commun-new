import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, CloseButton, up } from '@commun/ui';
import { userType } from 'types';

import OnboardingCarouselDots from 'components/common/OnboardingCarouselDots';
import OnboardingCarousel from 'components/common/OnboardingCarousel';
import Communities from './Communities';
import Share from './Share';
import Download from './Download';

export const Wrapper = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 480px;
  height: 100vh;
  background-color: #fff;
  overflow-y: auto;

  ${up.mobileLandscape} {
    border-radius: 20px;
    box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.05);
  }

  ${up.tablet} {
    height: 618px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 25px 5px;
  min-height: 30px;
  z-index: 1;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const Right = styled.div`
  z-index: 1;
`;

const Skip = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  cursor: pointer;
`;

export const BackButton = styled(CloseButton).attrs({ isBack: true })``;

const OnboardingRegistration = ({ user, close }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef();

  function onBack() {
    close();
  }

  function onChangeActive(index) {
    setActiveIndex(index);
  }

  function onNextClick() {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  }

  function onFinish() {
    close();
  }

  return (
    <Wrapper>
      <Header>
        <Left>{activeIndex > 0 ? null : <BackButton onClick={onBack} />}</Left>
        <OnboardingCarouselDots
          count={3}
          activeIndex={activeIndex}
          onChangeActive={onChangeActive}
        />
        <Right>
          <Skip onClick={onNextClick}>Skip</Skip>
        </Right>
      </Header>
      <OnboardingCarousel
        ref={carouselRef}
        activeIndex={activeIndex}
        onChangeActive={onChangeActive}
        onFinish={onFinish}
      >
        <Communities close={close} currentUserId={user.userId} />
        <Share />
        <Download />
      </OnboardingCarousel>
    </Wrapper>
  );
};

OnboardingRegistration.propTypes = {
  user: userType.isRequired,
  close: PropTypes.func.isRequired,
};

export default OnboardingRegistration;