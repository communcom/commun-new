import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { Icon } from '@commun/icons';

import { rotate } from 'animations/keyframes';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;

  ${isNot('noShadow')`
    background-color: rgba(255, 255, 255, 0.4);
  `};

  ${is('isStatic')`
    position: static;
  `};
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};

  ${isNot('noShadow')`
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
  `};
`;

const LoaderIcon = styled(Icon)`
  display: block;
  width: 32px;
  height: 32px;
  animation: ${rotate} 1s linear infinite;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
`;

export default function SplashLoader({ className, noShadow, isArc, isStatic }) {
  return (
    <Wrapper name="loader__circle" className={className} noShadow={noShadow} isStatic={isStatic}>
      {isArc ? (
        <LoaderIcon name="circle-loader-arc" />
      ) : (
        <LoaderWrapper noShadow={noShadow}>
          <LoaderIcon name="circle-loader" />
        </LoaderWrapper>
      )}
    </Wrapper>
  );
}

SplashLoader.propTypes = {
  isArc: PropTypes.bool,
  isStatic: PropTypes.bool,
  noShadow: PropTypes.bool,
};

SplashLoader.defaultProps = {
  isArc: false,
  isStatic: false,
  noShadow: false,
};
