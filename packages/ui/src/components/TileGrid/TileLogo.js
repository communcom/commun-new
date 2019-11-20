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
  font-weight: 600;
  text-transform: capitalize;
  text-align: center;
  font-size: ${({ size }) => SIZE[size].fontSize}px;

  overflow: hidden;
`;

const TileLogo = ({ className, text, logo, size, onItemClick }) => (
  <Tile className={className} size={size} onClick={onItemClick}>
    <LogoWrapper isLarge={size === 'large'}>{logo}</LogoWrapper>
    <TextWrapper size={size}>{text}</TextWrapper>
  </Tile>
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
