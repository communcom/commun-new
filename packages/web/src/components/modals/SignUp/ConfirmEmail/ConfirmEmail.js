/* stylelint-disable no-descending-specificity,property-no-vendor-prefix */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { ComplexInput } from '@commun/ui';
import { CREATE_USERNAME_SCREEN_ID, EMAIL_SCREEN_ID } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { setRegistrationData, getRegistrationData } from 'utils/localStore';

import { BackButton, SendButton, SubTitle, ErrorTextAbsolute } from '../commonStyled';

const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const InputWrapper = styled.div`
  margin: 52px 0;

  width: 100%;
  max-width: 304px;
  max-height: 56px;

  & input {
    padding: 17px 16px;
  }
`;

const CodeInput = styled(ComplexInput)`
  width: 100%;

  && input {
    text-align: left;
  }
`;

const ResendWrapper = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  margin-top: 24px;
`;

const ResendCode = styled.button.attrs({ type: 'button' })`
  line-height: 20px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.blue};

  &:hover,
  &:focus {
    opacity: 0.8;
  }

  ${is('disable')`
    cursor: auto;
    opacity: 0.6;
    pointer-events: none;
  `};
`;

const SendButtonStyled = styled(SendButton)`
  margin-top: 88px;
`;

@withTranslation()
export default class ConfirmEmail extends PureComponent {
  static propTypes = {
    setScreenId: PropTypes.func.isRequired,
    fetchRegVerifyEmail: PropTypes.func.isRequired,
    fetchResendEmail: PropTypes.func.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
  };

  state = {
    emailCode: '',
    codeError: '',
    resendError: '',
    isSubmiting: false,
  };

  componentWillUnmount() {
    const { clearRegErrors } = this.props;
    clearRegErrors();
  }

  enterVerificationCode = value => {
    const { emailCode } = this.state;

    const currentEmail = value.trim();

    if (emailCode !== currentEmail) {
      this.setState({
        emailCode: currentEmail,
      });
    }
  };

  onSubmit = async e => {
    if (e) {
      e.preventDefault();
    }

    const { setScreenId, fetchRegVerifyEmail, t } = this.props;
    const { emailCode } = this.state;

    if (!emailCode.length) {
      this.setState({
        codeError: t('modals.sign_up.confirmation_code_email.errors.enter_code'),
      });
      return;
    }

    this.setState({
      isSubmiting: true,
    });

    try {
      const screenId = await fetchRegVerifyEmail(emailCode);

      const currentScreenId = screenId || CREATE_USERNAME_SCREEN_ID;
      setScreenId(currentScreenId);
      setRegistrationData({ screenId: currentScreenId });
    } catch (err) {
      if (err === 'Wrong activation code') {
        this.setState({
          codeError: t('modals.sign_up.confirmation_code_email.errors.invalid_code'),
        });
      }
    } finally {
      this.setState({
        isSubmiting: false,
      });
    }
  };

  backToPreviousScreen = () => {
    const { setScreenId } = this.props;
    setScreenId(EMAIL_SCREEN_ID);
    setRegistrationData({ screenId: EMAIL_SCREEN_ID });
  };

  resendCode = async () => {
    const { fetchResendEmail, t } = this.props;

    const { email } = getRegistrationData();

    this.setState({
      codeError: '',
    });

    try {
      await fetchResendEmail(email);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      if (err.code === 1108) {
        this.setState({
          resendError: t('modals.sign_up.errors.too_many'),
        });
      }
      if (err.code === 1107) {
        this.setState({
          resendError: t('modals.sign_up.errors.try_later'),
        });
      }
    }
  };

  render() {
    const { t } = this.props;
    const { emailCode, codeError, isSubmiting, resendError } = this.state;

    return (
      <FormStyled onSubmit={this.onSubmit}>
        <SubTitle>{t('modals.sign_up.confirmation_code_email.title')}</SubTitle>
        <InputWrapper>
          <CodeInput
            autoFocus
            placeholder={t('modals.sign_up.confirmation_code_email.placeholder')}
            value={emailCode}
            className="js-EnterEmailCodeInput"
            onChange={this.enterVerificationCode}
          />
        </InputWrapper>
        <ResendWrapper>
          <ResendCode className="js-ConfirmationCodeResend" onClick={this.resendCode}>
            {t('modals.sign_up.confirmation_code_email.resend')}
          </ResendCode>
          <ErrorTextAbsolute>{codeError || resendError}</ErrorTextAbsolute>
        </ResendWrapper>
        <SendButtonStyled
          ref={this.sendButtonRef}
          className="js-ConfirmationCodeSend"
          disabled={isSubmiting}
        >
          {t('common.next')}
        </SendButtonStyled>
        <BackButton className="js-ConfirmationCodeBack" onClick={this.backToPreviousScreen}>
          {t('common.back')}
        </BackButton>
      </FormStyled>
    );
  }
}
