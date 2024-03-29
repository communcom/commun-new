import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import Tile from './Tile';

const SIZE = {
  medium: {
    fontSize: 12,
  },
  large: {
    fontSize: 17,
  },
};

const Wrapper = styled.div``;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 10px;

  ${is('isLarge')`
    margin-top: 45px;
  `}
`;

const TextWrapper = styled.div`
  height: 35px;
  font-size: ${({ size }) => SIZE[size].fontSize}px;
  font-weight: 600;
  text-transform: capitalize;
  text-align: center;

  overflow: hidden;
  text-overflow: ellipsis;
`;

const TileLogo = ({ className, text, logo, size, onItemClick }) => (
  <Wrapper className={className} onClick={onItemClick}>
    <Tile size={size}>
      <LogoWrapper isLarge={size === 'large'}>{logo}</LogoWrapper>
      <TextWrapper size={size}>{text}</TextWrapper>
    </Tile>
  </Wrapper>
);

TileLogo.propTypes = {
  logo: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['medium', 'large']),
  onItemClick: PropTypes.func,
};

TileLogo.defaultProps = {
  size: 'large',
  onItemClick: undefined,
};

export default TileLogo;
