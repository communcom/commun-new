import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';
import ExchangeSelect from './ExchangeSelect';
import ExchangeAddress from './ExchangeAddress';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  width: 100%;

  ${up.mobileLandscape} {
    width: 350px;

    border-radius: 25px;
  }
`;

const screens = [ExchangeSelect, ExchangeAddress];

function ExchangeCommun({ close, ...props }) {
  const [currentScreen, setCurrentScreen] = useState({ id: 0, props: {} });
  const ScreenComponent = screens[currentScreen.id];

  const changeScreen = useCallback(
    params => {
      setCurrentScreen({ id: params.id || 0, props: params.props || {} });
    },
    [setCurrentScreen]
  );

  return (
    <Wrapper>
      <ScreenComponent
        {...props}
        {...currentScreen.props}
        setCurrentScreen={changeScreen}
        close={close}
      />
    </Wrapper>
  );
}

ExchangeCommun.propTypes = {
  close: PropTypes.func.isRequired,
};

export default memo(ExchangeCommun);
