import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';

import { KEY_CODES, Link, styles } from '@commun/ui';
import { checkPressedKey } from 'utils/keyPress';
import { setRegistrationData } from 'utils/localStore';
import { displayError } from 'utils/toastsMessages';

import { SHOW_MODAL_LOGIN, OPENED_FROM_LOGIN } from 'store/constants/modalTypes';
import Recaptcha from 'components/common/Recaptcha';
import SplashLoader from 'components/common/SplashLoader';
import {
  CAPTCHA_KEY,
  CONFIRM_CODE_SCREEN_ID,
  DOC_BLOCKCHAIN_DISCLAIMER_LINK,
  DOC_PRIVACY_POLICY_LINK,
  DOC_USER_AGREEMENT_LINK,
} from 'shared/constants';
import {
  PHONE_NUMBER_EMPTY_ERROR,
  PHONE_NUMBER_SHORT_ERROR,
  LOC_DATA_ERROR,
  PHONE_NUMBER_INVALID,
} from '../constants';
import { SendButton, SubTitle, ErrorText, Input } from '../commonStyled';

import { createTimerCookie } from '../SignUp';
import CountryChooser from './CountryChooser';
import codesList from './codesList';

const DataInWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 304px;
`;

const PhoneInputWrapper = styled.label`
  display: flex;
  margin: 12px 0;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  cursor: text;
  transition: box-shadow 150ms;

  ${({ error, focused, theme }) => `
    color: ${theme.colors.black};
    ${error ? `box-shadow: 0 0 0 1px ${theme.colors.errorTextRed}` : ``};
    ${focused ? `box-shadow: 0 0 0 1px ${theme.colors.blue}` : ``};
  `};
`;

const PreInputNumberCode = styled.div`
  padding: 18px 13px 18px 16px;
  line-height: 20px;
  font-size: 17px;

  ${({ isFilled, theme }) => `
    color: ${isFilled ? theme.colors.black : theme.colors.gray};
  `};
`;

const PhoneInput = styled(Input)`
  ${is('isCode')`
    padding-left: 0;
  `};
`;

const ErrorTextStyled = styled(ErrorText)`
  margin-top: 14px;
  text-align: center;
`;

const UnavailableText = styled.span`
  margin-top: 5px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.errorTextRed};
  text-align: center;
  ${styles.overflowEllipsis};
`;

const TermsAgree = styled.p`
  padding: 0 18px;
  margin-top: 17px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
`;

const SendButtonStyled = styled(SendButton)`
  margin-top: 15px;
`;

export default class Phone extends PureComponent {
  static propTypes = {
    phoneNumber: PropTypes.string.isRequired,
    openedFrom: PropTypes.string,
    referralId: PropTypes.string,
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    setPhoneNumber: PropTypes.func.isRequired,
    setScreenId: PropTypes.func.isRequired,
    setLocationData: PropTypes.func.isRequired,
    locationData: PropTypes.shape({
      code: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      countryCode: PropTypes.string.isRequired,
      available: PropTypes.bool.isRequired,
    }).isRequired,
    fetchRegFirstStep: PropTypes.func.isRequired,
    isLoadingFirstStep: PropTypes.bool.isRequired,
    sendPhoneError: PropTypes.string.isRequired,
    firstStepStopLoader: PropTypes.func.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
    nextSmsRetry: PropTypes.number.isRequired,
    lookupGeoIp: PropTypes.func.isRequired,
  };

  static defaultProps = {
    openedFrom: '',
    referralId: undefined,
  };

  state = {
    phoneNumber: '',
    phoneNumberError: '',
    locationDataError: '',
    recaptchaResponse: '',
    isInputWrapperFocused: false,
  };

  // eslint-disable-next-line react/sort-comp
  phoneInputRef = createRef();

  componentDidMount() {
    const { phoneNumber } = this.props;
    if (phoneNumber) {
      this.setState({ phoneNumber });
    }

    this.tryLookupCountryByIp();
  }

  componentWillReceiveProps(nextProps) {
    const { phoneNumber, locationData } = this.props;
    if (phoneNumber !== nextProps.phoneNumber) {
      this.setState({ phoneNumber: nextProps.phoneNumber });
    }
    if (locationData.code !== nextProps.locationData.code) {
      this.resetLocDataError();
    }
  }

  componentWillUnmount() {
    const { clearRegErrors } = this.props;
    clearRegErrors();
  }

  setPhoneNumberInStore() {
    const { setPhoneNumber, phoneNumber: phoneNumberFromStore } = this.props;
    const { phoneNumber } = this.state;

    if (phoneNumberFromStore !== phoneNumber) {
      setPhoneNumber(phoneNumber);
      setRegistrationData({ phoneNumber });
    }
  }

  resetLocDataError = () => {
    const { locationDataError } = this.state;
    if (locationDataError) {
      this.setState({ locationDataError: '' });
    }
  };

  checkPhoneData = async () => {
    const {
      setScreenId,
      referralId,
      locationData,
      fetchRegFirstStep,
      isLoadingFirstStep,
      firstStepStopLoader,
    } = this.props;
    const { phoneNumber, recaptchaResponse } = this.state;

    if (isLoadingFirstStep) {
      return;
    }

    if (!locationData.code) {
      this.setState({ locationDataError: LOC_DATA_ERROR });
      return;
    }

    if (!phoneNumber) {
      this.setState({ phoneNumberError: PHONE_NUMBER_EMPTY_ERROR });
      return;
    }

    if ((phoneNumber.match(/\d/g) || []).length < 2) {
      this.setState({ phoneNumberError: PHONE_NUMBER_SHORT_ERROR });
      return;
    }

    if (CAPTCHA_KEY && !recaptchaResponse) {
      displayError('Recaptcha check failed');
      return;
    }

    try {
      const fullPhoneNumber = `+${locationData.code}${phoneNumber.replace(/[^0-9]+/g, '')}`;
      const isValidNumber = parsePhoneNumberFromString(fullPhoneNumber).isValid();

      if (!isValidNumber) {
        this.setState({ phoneNumberError: PHONE_NUMBER_INVALID });
        return;
      }
      // it will be returned after request on incorrect step
      const screenId = await fetchRegFirstStep(fullPhoneNumber, recaptchaResponse, referralId);
      const currentScreenId = screenId || CONFIRM_CODE_SCREEN_ID;
      firstStepStopLoader();
      // eslint-disable-next-line react/destructuring-assignment
      createTimerCookie(this.props.nextSmsRetry);
      setScreenId(currentScreenId);
      setRegistrationData({ screenId: currentScreenId });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
      firstStepStopLoader();
    }
  };

  enterKeyDown = e => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      this.setPhoneNumberInStore();
      this.checkPhoneData();
    }
  };

  enterPhoneNumber = e => {
    const { phoneNumber } = this.state;
    const currentPhoneNumber = e.target.value.replace(/[^\d()-]+/g, '');

    if (phoneNumber !== currentPhoneNumber) {
      this.setState({
        phoneNumber: currentPhoneNumber,
        phoneNumberError: '',
      });
    }
  };

  replaceWithLoginModal = async () => {
    const { openedFrom, openModal, close } = this.props;

    if (openedFrom === OPENED_FROM_LOGIN) {
      await close();
      openModal(SHOW_MODAL_LOGIN);
    } else {
      close();
    }
  };

  phoneInputBlured = () => {
    this.setPhoneNumberInStore();
    this.setState({ isInputWrapperFocused: false });
  };

  phoneInputFocused = () => {
    this.setState({ isInputWrapperFocused: true });
  };

  onCaptchaChange = e => {
    this.setState({
      recaptchaResponse: e,
    });
  };

  async tryLookupCountryByIp() {
    const { locationData, lookupGeoIp } = this.props;

    // Если уже выбрана страна, то ничего не делаем.
    if (locationData.code) {
      return;
    }

    try {
      const { countryCode } = await lookupGeoIp();

      const { locationData: actualData, setLocationData } = this.props;

      // Снова проверяем, так как за время запроса человек уже мог выбрать страну сам.
      if (actualData.code) {
        return;
      }

      const foundCountry = codesList.find(item => item.countryCode === countryCode);

      if (foundCountry) {
        setLocationData(foundCountry);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  render() {
    const { locationData, isLoadingFirstStep, sendPhoneError, setLocationData } = this.props;
    const { phoneNumber, phoneNumberError, locationDataError, isInputWrapperFocused } = this.state;
    const { code, available } = locationData;

    return (
      <>
        {isLoadingFirstStep ? <SplashLoader /> : null}
        <SubTitle>Enter your phone number</SubTitle>
        <DataInWrapper>
          <CountryChooser
            phoneInputRef={this.phoneInputRef}
            locationData={locationData}
            locationDataError={locationDataError}
            setLocationData={setLocationData}
            resetLocDataError={this.resetLocDataError}
          />
          {!available ? (
            // eslint-disable-next-line react/no-unescaped-entities
            <UnavailableText>Sorry but we don't support your region yet</UnavailableText>
          ) : null}
          <PhoneInputWrapper focused={isInputWrapperFocused} error={phoneNumberError}>
            {code ? (
              <PreInputNumberCode isFilled={phoneNumber ? 1 : 0}>+{code}</PreInputNumberCode>
            ) : null}
            <PhoneInput
              placeholder="Enter phone number"
              name="sign-up__phone-input"
              ref={this.phoneInputRef}
              value={phoneNumber}
              isCode={code ? 1 : 0}
              inputMode="numeric"
              onFocus={this.phoneInputFocused}
              onKeyDown={this.enterKeyDown}
              onChange={this.enterPhoneNumber}
              onBlur={this.phoneInputBlured}
            />
          </PhoneInputWrapper>
          <Recaptcha onCaptchaChange={this.onCaptchaChange} />
          <ErrorTextStyled>
            {locationDataError || phoneNumberError || sendPhoneError}
          </ErrorTextStyled>
          <TermsAgree>
            Continuing the registration, you agree to the{' '}
            <Link href={DOC_USER_AGREEMENT_LINK} target="_blank">
              User Agreement
            </Link>
            ,{' '}
            <Link href={DOC_PRIVACY_POLICY_LINK} target="_blank">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href={DOC_BLOCKCHAIN_DISCLAIMER_LINK} target="_blank">
              Blockchain Disclaimer
            </Link>
          </TermsAgree>
        </DataInWrapper>
        <SendButtonStyled className="js-VerificationCodeSend" onClick={this.checkPhoneData}>
          Send verification code
        </SendButtonStyled>
      </>
    );
  }
}
