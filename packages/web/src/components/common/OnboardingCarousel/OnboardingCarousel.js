/* eslint-disable react/no-array-index-key */
import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { KEY_CODES } from '@commun/ui';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Slide = styled.div`
  display: flex;
  height: 100%;
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

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = e => {
    switch (e.which) {
      case KEY_CODES.LEFT: {
        e.preventDefault();

        this.prev();
        break;
      }

      case KEY_CODES.RIGHT: {
        e.preventDefault();

        this.next();
        break;
      }

      default:
      // Do nothing
    }
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

    if (index + 1 >= slidesLength) {
      if (onFinish) {
        onFinish();
      }
      return;
    }

    ++index;

    onChangeActive(index);
  };

  render() {
    const { activeIndex, children } = this.props;

    return (
      <Wrapper>
        {React.Children.map(children, (slide, index) => {
          if (index !== activeIndex) {
            return null;
          }

          return (
            <Slide key={index}>
              {cloneElement(slide, {
                prev: this.prev,
                next: this.next,
              })}
            </Slide>
          );
        })}
      </Wrapper>
    );
  }
}
