/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { isNil } from 'ramda';

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
    animation: 7s linear ${animations.progress};

    ${is('isLong')`
      animation-duration: 15s;
    `};
  `};
`;

const ItemText = styled.button.attrs({ type: 'button' })`
  width: 100%;
  font-size: 18px;
  line-height: 25px;
  text-align: left;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.blue};
  }

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
    progressBarText: (
      <>
        The blockchain-based <br />
        social network
      </>
    ),
  },
];

const TICK_DURATION = 6500;
const TICK_DURATION_AFTER_CLICK = 14500;

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
    isStopped: false,
    isMountAnimationStarted: false,
    isUnmountAnimationStarted: false,
  };

  componentDidMount() {
    this.startTimer = setTimeout(() => {
      this.setState({
        isStarted: true,
      });
    }, 3000);
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

  onSelectSlide = e => {
    e.preventDefault();
    const { activeIndex, isUnmountAnimationStarted } = this.state;
    const { id } = e.target.dataset;

    if (isNil(id) || activeIndex === +id || isUnmountAnimationStarted) {
      return;
    }

    this.startUnmountAnimation(+id);
  };

  startPlaying() {
    const { isStopped } = this.state;
    const delay = isStopped ? TICK_DURATION_AFTER_CLICK : TICK_DURATION;

    if (this.switchTimer) {
      this.startMountAnimation();
      clearTimeout(this.switchTimer);
    }

    this.switchTimer = setTimeout(this.startUnmountAnimation, delay);
  }

  startMountAnimation = () => {
    this.setState({
      isMountAnimationStarted: true,
      isUnmountAnimationStarted: false,
    });
  };

  startUnmountAnimation = index => {
    this.setState(
      {
        isMountAnimationStarted: false,
        isUnmountAnimationStarted: true,
      },
      () => this.goToNextSlide(index)
    );
  };

  switchSlide = () => {
    this.setState(
      prevState => ({
        activeIndex: prevState.activeIndex === sections.length - 1 ? 0 : prevState.activeIndex + 1,
        isStopped: false,
      }),
      this.startPlaying
    );
  };

  switchSlideByClick = index => {
    this.setState(
      {
        activeIndex: index,
        isStopped: true,
      },
      this.startPlaying
    );
  };

  goToNextSlide = index => {
    clearTimeout(this.fadeOutAnimationTimer);

    this.fadeOutAnimationTimer = setTimeout(() => {
      if (isNil(index)) {
        this.switchSlide();
      } else {
        this.switchSlideByClick(index);
      }
    }, 500);
  };

  render() {
    const { isNeedStopAnimation } = this.props;
    const {
      activeIndex,
      isStarted,
      isStopped,
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
                  <ProgressBar isActive={activeIndex === id && isStarted} isLong={isStopped} />
                </ProgressBarHolder>
                <ItemText
                  isActive={activeIndex === id && isStarted}
                  name={`onboarding__go-to-slide-${id}`}
                  data-id={id}
                  onClick={this.onSelectSlide}
                >
                  {progressBarText}
                </ItemText>
              </ProgressBarItem>
            ))}
          </ProgressBarsList>
        </MainContainerStyled>
      </Wrapper>
    );
  }
}
