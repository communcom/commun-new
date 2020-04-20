import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SplashLoader, up } from '@commun/ui';

import Redirect from 'components/common/Redirect';

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

function AuthGuard({ isAutoLogging, isAuthorized, className }) {
  return (
    <LoaderWrapper className={className}>
      <SplashLoader isStatic noShadow />
      {!isAutoLogging && !isAuthorized ? <Redirect route="home" hidden /> : null}
    </LoaderWrapper>
  );
}

AuthGuard.propTypes = {
  isAutoLogging: PropTypes.bool,
  isAuthorized: PropTypes.bool,
};

AuthGuard.defaultProps = {
  isAutoLogging: false,
  isAuthorized: false,
};

export default memo(AuthGuard);
