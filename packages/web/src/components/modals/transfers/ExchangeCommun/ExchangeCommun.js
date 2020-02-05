import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';
import { EXCHANGE_MODALS } from './constants';

import ExchangeSelect from './ExchangeSelect';
import ExchangeAddress from './ExchangeAddress';
import ExchangeCard from './ExchangeCard';
import Exchange2FA from './Exchange2FA';
import ExchangeSuccess from './ExchangeSuccess';
import ExchangeError from './ExchangeError';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  width: 100%;

  ${up.mobileLandscape} {
    width: 350px;

    border-radius: 25px;
  }
`;

const screens = [
  ExchangeSelect,
  ExchangeAddress,
  ExchangeCard,
  Exchange2FA,
  ExchangeSuccess,
  ExchangeError,
];

function ExchangeCommun({ close, ...props }) {
  const [currentScreen, setCurrentScreen] = useState({
    id: EXCHANGE_MODALS.EXCHANGE_SELECT,
    props: {},
  });
  const ScreenComponent = screens[currentScreen.id];

  const changeScreen = useCallback(
    params => {
      setCurrentScreen({
        id: params.id || EXCHANGE_MODALS.EXCHANGE_SELECT,
        props: params.props || {},
      });
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
