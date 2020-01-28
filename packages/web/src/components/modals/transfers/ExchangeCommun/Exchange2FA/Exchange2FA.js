import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';

import { displayError } from 'utils/toastsMessages';

import { CircleLoader } from '@commun/ui';
import { Content, Wrapper } from 'components/modals/transfers/ExchangeCommun/common.styled';
import Header from 'components/modals/transfers/ExchangeCommun/common/Header';
import BillingInfoBlock from 'components/modals/transfers/ExchangeCommun/common/BillingInfoBlock';
import {
  ButtonStyled,
  InputStyled,
  ErrorWrapper,
  Error,
} from 'components/modals/transfers/common.styled';

const Input = styled(InputStyled)`
  margin-bottom: 10px;
`;

function validateCode(code) {
  const codeValue = parseInt(code, 10).toString();

  let error;

  switch (true) {
    case !code:
      error = 'Enter code';
      break;
    case codeValue.length !== 4:
      error = `Code must be 4 decimal places`;
      break;
    default:
  }

  return error;
}

export default function Exchange2FA({
  orderId,
  callbackUrl,
  sandboxCode,
  setCurrentScreen,
  close,
}) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeError, setCodeError] = useState(null);

  const onVerifyClick = async () => {
    setIsLoading(true);

    let response;

    try {
      response = await fetch(callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          verificationCode: code,
        }),
      });
    } catch (err) {
      displayError(err);
      return;
    } finally {
      setIsLoading(false);
    }

    try {
      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      if (result.status === 'success') {
        setCurrentScreen({ id: 4, props: { orderId: result.data.orderId } });
      }
    } catch (err) {
      displayError(err);
    }
  };

  const onCodeChange = e => {
    setCode(e.target.value);
    setCodeError(validateCode(e.target.value));
  };

  const isSubmitButtonDisabled = !code || codeError;

  return (
    <Wrapper>
      <Header isBlack close={close} />
      <Content>
        <div>
          Please complete your purchase by entering the 4 character code at the end of your recent
          charge description. Example: CARBON* BTC PURCHASE-1234.
        </div>

        {sandboxCode ? <div>Sandbox Code: {sandboxCode}</div> : null}

        <Input
          type="card"
          mask="9999"
          title="Verify code"
          placeholder="4 digit code"
          value={code}
          onChange={onCodeChange}
          required
        />

        {codeError ? (
          <ErrorWrapper>
            <Error>{codeError}</Error>
          </ErrorWrapper>
        ) : null}

        <BillingInfoBlock provider="Carbon" />

        {isLoading ? <CircleLoader /> : null}

        <ButtonStyled primary fluid disabled={isSubmitButtonDisabled} onClick={onVerifyClick}>
          Verify
        </ButtonStyled>
      </Content>
    </Wrapper>
  );
}

Exchange2FA.propTypes = {
  orderId: PropTypes.string.isRequired,
  callbackUrl: PropTypes.string.isRequired,
  sandboxCode: PropTypes.string,

  setCurrentScreen: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

Exchange2FA.defaultProps = {
  sandboxCode: null,
};
