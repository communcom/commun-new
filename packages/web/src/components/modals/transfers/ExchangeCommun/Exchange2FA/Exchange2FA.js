/* stylelint-disable no-descending-specificity,property-no-vendor-prefix */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';

import { STATUS_CARBON_SUCCESS } from 'shared/constants';
import { displayError } from 'utils/toastsMessages';
import { checkPressedKey } from 'utils/keyPress';

import { CircleLoader, KEY_CODES } from '@commun/ui';
import { Content, Wrapper } from 'components/modals/transfers/ExchangeCommun/common.styled';
import Header from 'components/modals/transfers/ExchangeCommun/common/Header';
import BillingInfoBlock from 'components/modals/transfers/ExchangeCommun/common/BillingInfoBlock';
import { ButtonStyled, ErrorWrapper, Error } from 'components/modals/transfers/common.styled';
import { NOT_FULL_CODE_ERROR } from 'components/modals/SignUp/constants';
import { EXCHANGE_MODALS } from 'components/modals/transfers/ExchangeCommun/constants';

const Center = styled.p`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

const ExampleBlock = styled.div`
  display: flex;
  justify-content: center;
  background: #29223d;
  background: linear-gradient(90.16deg, #29223d 0.09%, #19113a 99.93%), #c4c4c4;
`;

const ExampleImage = styled.div`
  width: 280px;
  height: 220px;
  background: url('/images/modals/2fa.png');
`;

const Form = styled.form``;

const DividedInput = styled.input`
  width: 50px;
  height: 60px;
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  transition: box-shadow 150ms;
  appearance: none;
  -moz-appearance: textfield;

  ${({ error, theme }) => (error ? `box-shadow: 0 0 0 1px ${theme.colors.errorTextRed};` : ``)};

  &:focus {
    color: ${({ theme }) => theme.colors.blue};
    box-shadow: 0 0 0 2px rgba(106, 128, 245, 0.5), 0 0 0 1px ${({ theme }) => theme.colors.blue};
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
`;

const InputsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0 50px;

  & ${DividedInput}:not(:first-child) {
    margin-left: 8px;
  }
`;

const NUMBER_OF_INPUTS = 4;

export default function Exchange2FA({
  orderId,
  callbackUrl,
  sandboxCode,
  setCurrentScreen,
  close,
}) {
  const [state, setState] = useState(() => ({
    inputs: Array.from({ length: NUMBER_OF_INPUTS }).map(() => ''),
    codeError: '',
    timerSeconds: false,
    isSubmiting: false,
  }));

  const inputsRefs = Array.from({ length: NUMBER_OF_INPUTS }).map(createRef);

  const sendButtonRef = useRef();

  const onSubmit = useCallback(
    async e => {
      if (e) {
        e.preventDefault();
      }

      const { inputs } = state;
      const codeStr = inputs.join('');
      const code = Number.parseInt(codeStr, 10);

      if (codeStr.length < NUMBER_OF_INPUTS) {
        setState(prevState => ({ ...prevState, codeError: NOT_FULL_CODE_ERROR }));
        return;
      }

      setState(prevState => ({
        ...prevState,
        isSubmiting: true,
      }));

      let response;

      try {
        response = await fetch(callbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            verificationCode: String(code),
          }),
        });
      } catch (err) {
        displayError(err);
        return;
      } finally {
        setState(prevState => ({
          ...prevState,
          isSubmiting: false,
        }));
      }

      try {
        const result = await response.json();

        if (!response.ok) {
          throw result;
        }

        if (result.status === STATUS_CARBON_SUCCESS) {
          setCurrentScreen({
            id: EXCHANGE_MODALS.EXCHANGE_SUCCESS,
            props: { orderId: result.data.orderId },
          });
        }
      } catch (err) {
        displayError(err);
      }
    },
    [state, callbackUrl, orderId, setCurrentScreen]
  );

  useEffect(() => {
    if (state.inputs.join('').length === NUMBER_OF_INPUTS) {
      sendButtonRef.current.focus();

      onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.inputs]);

  const onBackspacePress = (e, position) => {
    const { inputs } = state;

    if (checkPressedKey(e) !== KEY_CODES.BACKSPACE) {
      return;
    }

    const firstElemIndex = 0;
    if (position === firstElemIndex && !inputs[firstElemIndex]) {
      return;
    }

    const clonedInputs = Array.from(inputs);

    if (clonedInputs[position].trim()) {
      clonedInputs[position] = '';
    } else {
      clonedInputs[position - 1] = '';
    }

    setState(prevState => ({
      ...prevState,
      inputs: clonedInputs,
      codeError: '',
    }));

    if (position > firstElemIndex) {
      inputsRefs[position - 1].current.focus();
    }

    e.preventDefault();
  };

  const inputValueChange = (e, position) => {
    const { inputs } = state;

    let value = e.target.value.trim();
    value = value.replace(/\D+/g, '');

    if (!value) {
      return;
    }

    const clonedInputs = Array.from(inputs);

    const chars = value.split('');
    for (let i = 0; i < chars.length && i + position < NUMBER_OF_INPUTS; i++) {
      clonedInputs[i + position] = chars[i] || '';
    }

    setState(prevState => ({
      ...prevState,
      inputs: clonedInputs,
      codeError: '',
    }));

    const nextPos = position + 1;

    if (nextPos < NUMBER_OF_INPUTS) {
      inputsRefs[nextPos].current.focus();
    }
  };

  const notFullCodeError = state.codeError === NOT_FULL_CODE_ERROR;

  return (
    <Wrapper>
      <Header isBlack close={close} />
      <Content>
        <Center>
          Please complete your purchase by entering the 4 character code at the end of your recent
          charge description
        </Center>
        {/* template strings need for tests */}
        {sandboxCode ? <div>{`Sandbox Code: ${sandboxCode}`}</div> : null}
      </Content>

      <ExampleBlock>
        <ExampleImage />
      </ExampleBlock>

      <Content>
        <Form onSubmit={onSubmit}>
          <InputsWrapper>
            {Array.from({ length: NUMBER_OF_INPUTS }).map((item, index) => (
              <DividedInput
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                ref={inputsRefs[index]}
                type="number"
                min="0"
                max="9"
                maxLength="1"
                name={`payment__verification-2fa-code-carbon-input-${index + 1}`}
                autoFocus={index === 0}
                autoComplete="off"
                inputMode="numeric"
                value={state.inputs[index]}
                error={notFullCodeError && !state.inputs[index]}
                className={`js-Verification2faCodeCarbonInput-${index}`}
                onKeyDown={e => onBackspacePress(e, index)}
                onChange={e => inputValueChange(e, index)}
              />
            ))}
          </InputsWrapper>

          {state.codeError ? (
            <ErrorWrapper>
              <Error>{state.codeError}</Error>
            </ErrorWrapper>
          ) : null}

          <BillingInfoBlock provider="Carbon" />

          {state.isSubmiting ? <CircleLoader /> : null}

          <ButtonStyled
            type="submit"
            ref={sendButtonRef}
            primary
            fluid
            disabled={state.isSubmiting}
          >
            Verify
          </ButtonStyled>
        </Form>
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
