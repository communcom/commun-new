import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Glyph } from '@commun/ui';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 10px 42px;

  width: 335px;

  background-color: ${({ theme }) => theme.colors.mediumBlue};
  border-radius: 15px;
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

const ActionsPanel = ({ sendPointsHandler, buyPontsHandler, convertPointsHandler, className }) => (
  <Wrapper className={className}>
    <Action name="total-balance__send-points" onClick={sendPointsHandler}>
      <SendIcon />
      Send
    </Action>
    <Action name="total-balance__buy-points" onClick={buyPontsHandler}>
      <BuyIcon />
      Buy
    </Action>
    <Action name="total-balance__convert-points" onClick={convertPointsHandler}>
      <ConvertIcon />
      Convert
    </Action>
  </Wrapper>
);

ActionsPanel.propTypes = {
  sendPointsHandler: PropTypes.func.isRequired,
  buyPontsHandler: PropTypes.func.isRequired,
  convertPointsHandler: PropTypes.func.isRequired,
};

export default ActionsPanel;