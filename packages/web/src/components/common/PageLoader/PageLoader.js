import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SplashLoader, up } from '@commun/ui';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;

  ${up.mobileLandscape} {
    height: 70vh;
    border-radius: 10px;
    overflow: hidden;
  }
`;

function PageLoader({ isStatic, className }) {
  return (
    <LoaderWrapper className={className}>
      <SplashLoader isStatic={isStatic} noShadow />
    </LoaderWrapper>
  );
}

PageLoader.propTypes = {
  isStatic: PropTypes.bool,
};

PageLoader.defaultProps = {
  isStatic: false,
};

export default PageLoader;
