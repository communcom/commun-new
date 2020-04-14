import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SIZE = {
  medium: {
    marginRight: 5,
    width: 90,
    height: 122,
    borderRadius: 10,
  },
  large: {
    marginRight: 10,
    width: 140,
    height: 190,
    borderRadius: 15,
  },
  xl: {
    marginRight: 10,
    width: 160,
    height: 200,
    borderRadius: 6,
  },
};

const Tile = styled.li`
  display: flex;
  flex-direction: column;

  padding: 15px;
  margin-right: ${({ size }) => SIZE[size].marginRight}px;

  min-width: ${({ size }) => SIZE[size].width}px;
  max-width: ${({ size }) => SIZE[size].width}px;
  height: ${({ size }) => SIZE[size].height}px;

  border-radius: ${({ size }) => SIZE[size].borderRadius}px;

  background-color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  outline: none;
  overflow: hidden;
`;

const TileItem = ({ size, autoFocus, ...props }) => {
  const tileRef = useRef();

  useEffect(() => {
    if (tileRef.current && autoFocus) {
      tileRef.current.focus();
    }
  }, [autoFocus]);

  return <Tile ref={tileRef} size={size} {...props} />;
};

TileItem.propTypes = {
  size: PropTypes.oneOf(['medium', 'large', 'xl']),
  autoFocus: PropTypes.bool,
};

TileItem.defaultProps = {
  size: 'large',
  autoFocus: false,
};

export default TileItem;
