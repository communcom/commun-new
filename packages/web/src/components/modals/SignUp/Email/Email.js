import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import styled from 'styled-components';

import { ComplexInput } from '@commun/ui';

import { CAPTCHA_KEY, CONFIRM_EMAIL_SCREEN_ID } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { captureException } from 'utils/errors';
import { setRegistrationData } from 'utils/localStore';
import { displayError } from 'utils/toastsMessages';
import { validateEmail } from 'utils/validatingInputs';
import { SHOW_MODAL_LOGIN } from 'store/constants/modalTypes';

import Recaptcha from 'components/common/Recaptcha';
import TermsAgree from '../common/TermsAgree';
import { ErrorText, SendButton, SubTitle } from '../commonStyled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 304px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 304px;
  max-height: 56px;
  margin: 52px 0;

  & input {
    padding: 17px 16px;
  }
`;

const EmailInput = styled(ComplexInput)`
  width: 100%;

  && input {
    text-align: left;
  }
`;

const SendButtonStyled = styled(SendButton)`
  margin-top: 15px;
`;

const SwitchWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 30px;
`;

const SwitchText = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
`;

const SwitchButton = styled(SwitchText).attrs({ as: 'button', type: 'button' })`
  color: ${({ theme }) => theme.colors.blue};
`;

const ErrorTextStyled = styled(ErrorText)`
  flex-shrink: 0;
  margin-top: 14px;
  text-align: center;
`;

const SubTitleStyled = styled(SubTitle)`
  margin-top: 0;
`;

const TermsAgreeStyled = styled(TermsAgree)`
  margin-top: 100px;
`;

@withTranslation()
export default class Email extends PureComponent {
  static propTypes = {
    referralId: PropTypes.string,

    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    fetchRegFirstStepEmail: PropTypes.func.isRequired,
    setScreenId: PropTypes.func.isRequired,
  };

  static defaultProps = {
    referralId: undefined,
  };

  state = {
    email: '',
    emailError: '',
    recaptchaResponse: '',
  };

  checkEmail = debounce(email => {
    const isValid = validateEmail(email);

    this.setState({
      // eslint-disable-next-line react/destructuring-assignment
      emailError: isValid ? '' : this.props.t('modals.sign_up.email.errors.email_is_not_valid'),
    });
  }, 500);

  componentWillUnmount() {
    this.checkEmail.cancel();
  }

  replaceWithLoginModal = () => {
    const { openModal, close } = this.props;

    close(openModal(SHOW_MODAL_LOGIN));
  };

  onCaptchaChange = e => {
    this.setState({
      recaptchaResponse: e,
    });
  };

  nextScreen = async () => {
    const { setScreenId, referralId, fetchRegFirstStepEmail, t } = this.props;
    const { email, emailError, recaptchaResponse } = this.state;

    if (!email) {
      this.setState({
        emailError: t('modals.sign_up.email.errors.enter_your_email'),
      });

      return;
    }

    if (emailError) {
      return;
    }

    if (CAPTCHA_KEY && !recaptchaResponse) {
      displayError(t('modals.sign_up.errors.recaptcha_check'));
      return;
    }

    try {
      const screenId = await fetchRegFirstStepEmail(email, recaptchaResponse, referralId);
      const currentScreenId = screenId || CONFIRM_EMAIL_SCREEN_ID;

      setScreenId(currentScreenId);
      setRegistrationData({ screenId: currentScreenId });
    } catch (err) {
      if (err === 'Account already registered') {
        this.setState({
          emailError: t('modals.sign_up.email.errors.account_already_exists'),
        });
      } else {
        captureException(err);
      }
    }
  };

  enterEmail = value => {
    const { email } = this.state;

    let currentEmail = value.trim();
    currentEmail = currentEmail.toLowerCase();
    this.checkEmail(currentEmail);

    if (email !== currentEmail) {
      this.setState({
        email: currentEmail,
      });
    }
  };

  render() {
    const { t } = this.props;
    const { email, emailError } = this.state;

    return (
      <Wrapper>
        <SubTitleStyled>{t('modals.sign_up.email.description')}</SubTitleStyled>
        <InputWrapper>
          <EmailInput
            autoFocus
            placeholder={t('modals.sign_up.email.placeholder')}
            value={email}
            className="js-EnterEmailInput"
            onChange={this.enterEmail}
          />
          {emailError ? <ErrorTextStyled>{emailError}</ErrorTextStyled> : null}
        </InputWrapper>
        <Recaptcha onCaptchaChange={this.onCaptchaChange} />
        <TermsAgreeStyled />
        <SendButtonStyled
          disabled={emailError}
          className="js-EnterEmailSend"
          onClick={this.nextScreen}
        >
          {t('common.next')}
        </SendButtonStyled>
        <SwitchWrapper>
          <SwitchText>{t('modals.sign_up.sign_in_text')}</SwitchText>
          <SwitchButton onClick={this.replaceWithLoginModal}>
            &nbsp;{t('modals.sign_up.sign_in')}
          </SwitchButton>
        </SwitchWrapper>
      </Wrapper>
    );
  }
}
