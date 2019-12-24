import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';
import ExchangeSellect from './ExchangeSelect';
import ExchangeAddress from './ExchangeAddress';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  width: 100%;

  background-color: ${({ theme }) => theme.colors.blue};

  ${up.mobileLandscape} {
    width: 350px;

    border-radius: 25px;
  }
`;

const screens = [ExchangeSellect, ExchangeAddress];

function ExchangeCommun({ close, ...props }) {
  const [currentScreen, setCurrentScreen] = useState({ id: 0, props: {} });
  const ScreenComponent = screens[currentScreen.id || 0];

  return (
    <Wrapper>
      <ScreenComponent
        {...props}
        {...(currentScreen.props || {})}
        setCurrentScreen={setCurrentScreen}
        close={close}
      />
    </Wrapper>
  );
}

ExchangeCommun.propTypes = {
  close: PropTypes.func.isRequired,
};

export default memo(ExchangeCommun);
