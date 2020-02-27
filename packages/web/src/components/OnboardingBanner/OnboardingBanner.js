/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { MainContainer, animations } from '@commun/ui';
import Slides from './Slides';

const Wrapper = styled.section`
  width: 100%;
  height: 583px;
  background-color: #fff;
  overflow-x: hidden;
`;

const MainContainerStyled = styled(MainContainer)`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  height: 100%;
  padding-top: 0 !important;
  padding-bottom: 80px !important;
`;

const ProgressBarsList = styled.ul`
  display: flex;
`;

const ProgressBarItem = styled.li`
  width: calc((100% - 50px) / 3);

  &:not(:last-child) {
    margin-right: 25px;
  }
`;

const ProgressBarHolder = styled.div`
  position: relative;
  width: 100%;
  height: 4px;
  margin-bottom: 16px;
  background-color: #e2e6e8;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 4px;
  transform: translateX(-100%);
  will-change: transform;

  ${is('isActive')`
    animation: 5s linear ${animations.progress};
  `};
`;

const ItemText = styled.p`
  font-size: 18px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.2s;

  ${is('isActive')`
    color: ${({ theme }) => theme.colors.blue};
  `};

  @media (max-width: 1150px) {
    font-size: 16px;
    line-height: 20px;
  }
`;

const sections = [
  {
    id: 0,
    title: (
      <>
        Here you get rewards
        <br /> for your posts and likes
      </>
    ),
    desc: (
      <>
        Create posts, vote for them, comment and discuss
        <br /> and receive rewards in Community Points
      </>
    ),
    image: {
      scr: '/images/onboarding/landing/first.png',
      style: {
        width: 403,
        margin: '0 19px',
      },
    },
    progressBarText: (
      <>
        People receive rewards <br />
        for their posts and likes
      </>
    ),
  },
  {
    id: 1,
    title: 'Thematic communities',
    desc: (
      <>
        Choose your community, and it will reward your actions.
        <br /> Easy as is!
      </>
    ),
    image: {
      scr: '/images/onboarding/all-in-one.png',
    },
    progressBarText: (
      <>
        Thematic
        <br />
        communities
      </>
    ),
  },
  {
    id: 2,
    title: (
      <>
        The blockchain-based
        <br /> social network
      </>
    ),
    desc:
      'Thanks to the blockchain, It’s now possible for social networks to reward their users and provide autonomy to communities',
    image: {
      scr: '/images/onboarding/landing/third.png',
    },
    progressBarText: (
      <>
        The blockchain-based <br />
        social network
      </>
    ),
  },
];

const TICK_DURATION = 4500;

export default class OnboardingBanner extends Component {
  static propTypes = {
    isNeedStopAnimation: PropTypes.bool,
  };

  static defaultProps = {
    isNeedStopAnimation: false,
  };

  state = {
    activeIndex: 0,
    isStarted: false,
    isMountAnimationStarted: false,
    isUnmountAnimationStarted: false,
  };

  componentDidMount() {
    this.startTimer = setTimeout(() => {
      this.setState({
        isStarted: true,
      });
    }, 5000);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isNeedStopAnimation } = this.props;
    const { activeIndex, isStarted } = this.state;

    if (prevState.activeIndex !== activeIndex || prevState.isStarted !== isStarted) {
      this.startPlaying();
    }

    if (prevProps.isNeedStopAnimation !== isNeedStopAnimation) {
      this.setState({
        isStarted: !isNeedStopAnimation,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.switchTimer);
    clearTimeout(this.startTimer);
    clearTimeout(this.fadeOutAnimationTimer);
  }

  startPlaying() {
    if (this.switchTimer) {
      this.startMountAnimation();
      clearTimeout(this.switchTimer);
    }

    this.switchTimer = setTimeout(this.startUnmountAnimation, TICK_DURATION);
  }

  startMountAnimation = () => {
    this.setState({
      isMountAnimationStarted: true,
      isUnmountAnimationStarted: false,
    });
  };

  startUnmountAnimation = () => {
    this.setState(
      {
        isMountAnimationStarted: false,
        isUnmountAnimationStarted: true,
      },
      this.goToNextSlide
    );
  };

  goToNextSlide = () => {
    clearTimeout(this.fadeOutAnimationTimer);

    this.fadeOutAnimationTimer = setTimeout(() => {
      this.setState(
        prevState => ({
          activeIndex:
            prevState.activeIndex === sections.length - 1 ? 0 : prevState.activeIndex + 1,
        }),
        this.startPlaying
      );
    }, 500);
  };

  render() {
    const { isNeedStopAnimation } = this.props;
    const {
      activeIndex,
      isStarted,
      isMountAnimationStarted,
      isUnmountAnimationStarted,
    } = this.state;

    if (isNeedStopAnimation) {
      return <Wrapper />;
    }

    return (
      <Wrapper>
        <MainContainerStyled>
          <Slides
            activeIndex={activeIndex}
            sections={sections}
            isMountAnimationStarted={isMountAnimationStarted}
            isUnmountAnimationStarted={isUnmountAnimationStarted}
          />
          <ProgressBarsList>
            {sections.map(({ id, progressBarText }) => (
              <ProgressBarItem key={id}>
                <ProgressBarHolder>
                  <ProgressBar isActive={activeIndex === id && isStarted} />
                </ProgressBarHolder>
                <ItemText isActive={activeIndex === id && isStarted}>{progressBarText}</ItemText>
              </ProgressBarItem>
            ))}
          </ProgressBarsList>
        </MainContainerStyled>
      </Wrapper>
    );
  }
}
