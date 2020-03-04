/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { isNil } from 'ramda';

import { MainContainer, CloseButton, animations, up } from '@commun/ui';
import { getMobileAppUrl } from 'utils/mobile';

import OnboardingCarouselDots from 'components/common/OnboardingCarouselDots';
import Slides from './Slides';
import MobileSlides from './MobileSlides';
import { sections, mobileSections } from './sections';

const Wrapper = styled.section`
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 29;
  width: 100%;
  padding: 20px;
  margin-top: auto;
  background-color: #fff;
  box-shadow: 0 1px 25px rgba(0, 0, 0, 0.25);
  border-radius: 24px 24px 0 0;
  transform: translateY(100%);
  visibility: hidden;
  transition: transform 0.5s 1.5s;
  will-change: transform;
  overflow-x: hidden;
  overscroll-behavior: none;

  ${is('isStarted')`
    transform: translateY(0);
    visibility: visible;
  `};

  ${up.tablet} {
    position: static;
    height: 583px;
    padding: 0;
    margin: 0;
    box-shadow: none;
    border-radius: 0;
    transform: unset;
    visibility: unset;
    transition: unset;
    will-change: unset;
    overscroll-behavior: unset;
  }
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

const OnboardingCarouselDotsStyled = styled(OnboardingCarouselDots)`
  position: static;
  margin-bottom: 10px;
`;

const CloseButtonStyled = styled(CloseButton)`
  position: absolute;
  z-index: 5;
  top: 15px;
  right: 25px;
`;

const TICK_DURATION = 6500;
const TICK_DURATION_AFTER_CLICK = 14500;

export default class OnboardingBanner extends Component {
  static propTypes = {
    isNeedStopAnimation: PropTypes.bool,
    isMobile: PropTypes.bool,
    isClosed: PropTypes.bool,

    onCloseClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isNeedStopAnimation: false,
    isMobile: false,
    isClosed: false,
  };

  state = {
    activeIndex: 0,
    appLink: '',
    isStarted: false,
    isStopped: false,
    isMountAnimationStarted: false,
    isUnmountAnimationStarted: false,
  };

  componentDidMount() {
    this.startTimer = setTimeout(() => {
      this.setState({
        appLink: getMobileAppUrl(),
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

  onCloseClick = () => {
    const { onCloseClick } = this.props;

    onCloseClick(true);
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
    const { isMobile } = this.props;

    const slides = isMobile ? mobileSections : sections;

    this.setState(
      prevState => ({
        activeIndex: prevState.activeIndex === slides.length - 1 ? 0 : prevState.activeIndex + 1,
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

  renderDesktopBanner() {
    const {
      activeIndex,
      isStarted,
      isStopped,
      isMountAnimationStarted,
      isUnmountAnimationStarted,
    } = this.state;

    return (
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
    );
  }

  renderMobileBanner() {
    const { activeIndex, appLink, isMountAnimationStarted, isUnmountAnimationStarted } = this.state;

    return (
      <>
        <OnboardingCarouselDotsStyled count={mobileSections.length} activeIndex={activeIndex} />
        <CloseButtonStyled
          big
          size={18}
          name="onboarding-banner__close"
          onClick={this.onCloseClick}
        />
        <MobileSlides
          activeIndex={activeIndex}
          appLink={appLink}
          sections={mobileSections}
          isMountAnimationStarted={isMountAnimationStarted}
          isUnmountAnimationStarted={isUnmountAnimationStarted}
          startUnmountAnimation={this.startUnmountAnimation}
        />
      </>
    );
  }

  render() {
    const { isNeedStopAnimation, isMobile, isClosed } = this.props;
    const { isStarted } = this.state;

    if (isMobile && isClosed) {
      return null;
    }

    let content;

    if (isNeedStopAnimation) {
      content = null;
    } else if (isMobile) {
      content = this.renderMobileBanner();
    } else {
      content = this.renderDesktopBanner();
    }

    return <Wrapper isStarted={isStarted}>{content}</Wrapper>;
  }
}
