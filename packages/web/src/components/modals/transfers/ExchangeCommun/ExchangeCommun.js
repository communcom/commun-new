import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

import { up } from '@commun/ui';
import Header from './common/Header';

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

const screens = [dynamic(import('./ExchangeSelect')), dynamic(import('./ExchangeAddress'))];

function ExchangeCommun({ close, ...props }) {
  const [currentScreen, setCurrentScreen] = useState({ id: 0, props: {} });
  const ScreenComponent = screens[currentScreen.id || 0];

  return (
    <Wrapper>
      <Header id={currentScreen.id} close={close} />
      <ScreenComponent
        {...props}
        {...(currentScreen.props || {})}
        setCurrentScreen={setCurrentScreen}
      />
    </Wrapper>
  );
}

ExchangeCommun.propTypes = {
  close: PropTypes.func.isRequired,
};

export default memo(ExchangeCommun);
