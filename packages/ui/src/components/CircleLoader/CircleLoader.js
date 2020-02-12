import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNot } from 'styled-is';

import { Icon } from '@commun/icons';

import { rotate } from 'animations/keyframes';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  ${isNot('noShadow')`
    background-color: rgba(255, 255, 255, 0.4);
  `};
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
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

export default function CircleLoader({ className, noShadow, isArc }) {
  return (
    <Wrapper name="loader__circle" className={className} noShadow={noShadow}>
      {isArc ? (
        <LoaderIcon name="circle-loader-arc" />
      ) : (
        <LoaderWrapper>
          <LoaderIcon name="circle-loader" />
        </LoaderWrapper>
      )}
    </Wrapper>
  );
}

CircleLoader.propTypes = {
  isArc: PropTypes.bool,
  noShadow: PropTypes.bool,
};

CircleLoader.defaultProps = {
  isArc: false,
  noShadow: false,
};
