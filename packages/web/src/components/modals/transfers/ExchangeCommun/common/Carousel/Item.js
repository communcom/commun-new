import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const first = 46;
const second = 63;

const Wrapper = styled.div`
  position: absolute;
  display: inline-block;
  height: 50px;
  width: 50px;
  transition: opacity 0.1s ease-in, transform 0.1s ease-in;
  cursor: pointer;

  &.level-2 {
    transform: translateX(0) scale(0.48);
    opacity: 0.3;
  }

  &.level-1 {
    transform: translateX(${first}px) scale(0.72);
    opacity: 0.5;
  }

  &.level0 {
    transform: translateX(${first + second}px) scale(1);
    opacity: 1;
  }

  &.level1 {
    transform: translateX(${first + 2 * second}px) scale(0.72);
    opacity: 0.5;
  }

  &.level2 {
    transform: translateX(${2 * first + 2 * second}px) scale(0.48);
    opacity: 0.3;
  }
`;

export default function Item(props) {
  const { level, children } = props;

  return <Wrapper className={`level${level}`}>{children}</Wrapper>;
}

Item.propTypes = {
  level: PropTypes.number.isRequired,
};
