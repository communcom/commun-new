import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up, styles, SplashLoader } from '@commun/ui';

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

const RedirectStyled = styled(Redirect)`
  ${styles.visuallyHidden};
`;

function AuthGuard({ isAutoLogging, isAuthorized, className }) {
  return (
    <LoaderWrapper className={className}>
      <SplashLoader isStatic noShadow />
      {!isAutoLogging && !isAuthorized ? <RedirectStyled route="home" /> : null}
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
