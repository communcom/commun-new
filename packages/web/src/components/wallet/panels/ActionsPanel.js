import React from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import styled from 'styled-components';

import { Glyph, up } from '@commun/ui';
import { FEATURE_EXCHANGE_COMMON } from 'shared/featureFlags';

const Wrapper = styled.div`
  display: flex;
  /* justify-content: space-between; */
  justify-content: space-around;

  padding: 10px 42px;

  width: 100%;

  background-color: ${({ theme }) => theme.colors.mediumBlue};
  border-radius: 15px;

  ${up.mobileLandscape} {
    width: 300px;
  }
`;

const SendIcon = styled(Glyph).attrs({ icon: 'arrow', size: 'small' })`
  margin-bottom: 7px;

  background-color: ${({ theme }) => theme.colors.lightBlue};
  transform: rotate(180deg);
`;

const BuyIcon = styled(Glyph).attrs({ icon: 'add', size: 'small' })`
  margin-bottom: 7px;

  background-color: ${({ theme }) => theme.colors.lightBlue};

  & > svg {
    width: 14px;
    height: 14px;
  }
`;

const ConvertIcon = styled(Glyph).attrs({ icon: 'convert', size: 'small' })`
  margin-bottom: 7px;

  background-color: ${({ theme }) => theme.colors.lightBlue};
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: 12px;

  color: ${({ theme }) => theme.colors.white};
  outline: none;
`;

const ActionsPanel = ({
  sendPointsHandler,
  exchangeCommunHandler,
  convertPointsHandler,
  symbol,
  featureToggles,
  className,
}) => (
  <Wrapper className={className}>
    <Action name="total-balance__send-points" onClick={sendPointsHandler}>
      <SendIcon />
      Send
    </Action>
    {featureToggles[FEATURE_EXCHANGE_COMMON] && symbol === 'CMN' ? (
      <Action name="total-balance__buy-points" onClick={exchangeCommunHandler}>
        <BuyIcon />
        Buy
      </Action>
    ) : null}
    <Action name="total-balance__convert-points" onClick={convertPointsHandler}>
      <ConvertIcon />
      Convert
    </Action>
  </Wrapper>
);

ActionsPanel.propTypes = {
  sendPointsHandler: PropTypes.func.isRequired,
  exchangeCommunHandler: PropTypes.func.isRequired,
  convertPointsHandler: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  featureToggles: PropTypes.object.isRequired,
};

export default injectFeatureToggles([FEATURE_EXCHANGE_COMMON])(ActionsPanel);
