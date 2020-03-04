import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import { rotate, fadeIn } from 'animations/keyframes';

const Wrapper = styled.div`
  display: inline-block;
  animation: ${fadeIn} 0.25s;
`;

export const LoaderIcon = styled(Icon)`
  display: block;
  width: 24px;
  height: 24px;
  animation: ${rotate} 1s linear infinite;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
`;

LoaderIcon.defaultProps = {
  name: 'circle-loader',
};

function Loader({ className, iconName }, ref) {
  return (
    <Wrapper ref={ref} className={className}>
      <LoaderIcon name={iconName} />
    </Wrapper>
  );
}

Loader.propTypes = {
  iconName: PropTypes.string,
};

Loader.defaultProps = {
  iconName: 'circle-loader',
};

export default forwardRef(Loader);
