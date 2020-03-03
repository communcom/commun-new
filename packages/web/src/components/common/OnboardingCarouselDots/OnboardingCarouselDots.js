/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'ramda';
import styled from 'styled-components';
import is from 'styled-is';

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
`;

const Dots = styled.ul`
  display: flex;
  align-self: center;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Dot = styled.li`
  display: flex;
  align-items: center;
  margin-right: 6px;

  &::before {
    display: inline-block;
    content: '';
    height: 5px;
    width: 5px;
    background: #e2e6e8;
    border-radius: 10px;
    transition: all 300ms ease;

    ${is('onClick')`
      cursor: pointer;
    `};
  }

  ${is('active')`
    &::before {
      width: 20px;
      background: ${({ theme }) => theme.colors.blue};
    }
  `}
`;

const OnboardingCarouselDots = ({ count, activeIndex, onChangeActive, className }) => (
  <Wrapper className={className}>
    <Dots>
      {range(0, count).map((item, index) => (
        <Dot
          key={index}
          active={item === activeIndex}
          onClick={onChangeActive ? () => onChangeActive(item) : undefined}
        />
      ))}
    </Dots>
  </Wrapper>
);

OnboardingCarouselDots.propTypes = {
  count: PropTypes.number.isRequired,
  activeIndex: PropTypes.number,
  onChangeActive: PropTypes.func,
};

OnboardingCarouselDots.defaultProps = {
  activeIndex: 0,
  onChangeActive: undefined,
};

export default OnboardingCarouselDots;
