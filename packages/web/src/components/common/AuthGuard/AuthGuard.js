import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SplashLoader, styles } from '@commun/ui';

import Redirect from 'components/common/Redirect';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
`;

const SplashLoaderStyled = styled(SplashLoader)`
  position: static;
`;

const RedirectStyled = styled(Redirect)`
  ${styles.visuallyHidden};
`;

function AuthGuard({ isAutoLogging, isAuthorized, className }) {
  return (
    <LoaderWrapper className={className}>
      <SplashLoaderStyled />
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
