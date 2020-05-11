import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';
import { SELL_MODALS } from './constants';

import SellSelect from './SellSelect';
import SellAddress from './SellAddress';
import SellSuccess from './SellSuccess';

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
  SellSelect,
  SellAddress,
  SellSuccess,
  // SellError,
];

function SellCommun({ close, ...props }) {
  const [currentScreen, setCurrentScreen] = useState({
    id: SELL_MODALS.SELL_SELECT,
    props: {},
  });
  const ScreenComponent = screens[currentScreen.id];

  const changeScreen = useCallback(
    params => {
      setCurrentScreen({
        id: params.id || SELL_MODALS.SELL_SELECT,
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

SellCommun.propTypes = {
  close: PropTypes.func.isRequired,
};

export default memo(SellCommun);
