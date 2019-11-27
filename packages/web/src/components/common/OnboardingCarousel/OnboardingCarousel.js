/* eslint-disable react/no-array-index-key */
import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNot } from 'styled-is';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Slide = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  ${isNot('active')`
    display: none;
  `}
`;

export default class OnboardingCarousel extends Component {
  static propTypes = {
    activeIndex: PropTypes.number,
    onChangeActive: PropTypes.func.isRequired,
    onFinish: PropTypes.func,
  };

  static defaultProps = {
    activeIndex: 0,
    onFinish: undefined,
  };

  prev = () => {
    const { activeIndex, onChangeActive } = this.props;

    let index = activeIndex;

    if (index > 0) {
      --index;
    }

    onChangeActive(index);
  };

  next = () => {
    const { activeIndex, children, onChangeActive, onFinish } = this.props;

    let index = activeIndex;
    const slidesLength = children.length || 1;

    if (index + 1 >= slidesLength && onFinish) {
      onFinish();
      return;
    }

    ++index;

    onChangeActive(index);
  };

  render() {
    const { activeIndex, children } = this.props;

    return (
      <Wrapper>
        {React.Children.map(children, (slide, index) => (
          <Slide key={index} active={index === activeIndex}>
            {cloneElement(slide, {
              prev: this.prev,
              next: this.next,
            })}
          </Slide>
        ))}
      </Wrapper>
    );
  }
}
