import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';

import { CircleLoader, KEY_CODES } from '@commun/ui';
import { checkPressedKey } from 'utils/keyPress';
import { setRegistrationData } from 'utils/localStore';

import { SHOW_MODAL_LOGIN, MODAL_CANCEL, OPENED_FROM_LOGIN } from 'store/constants/modalTypes';
import {
  PHONE_NUMBER_EMPTY_ERROR,
  PHONE_NUMBER_SHORT_ERROR,
  LOC_DATA_ERROR,
  CONFIRM_CODE_SCREEN_ID,
} from '../constants';
import { BackButton, SendButton, SubTitle, ErrorText, Input } from '../commonStyled';

import { createTimerCookie } from '../SignUp';
import CountryChooser from './CountryChooser';

const DataInWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  ${up('tablet')} {
    max-width: 288px;
  }
`;

const PhoneInputWrapper = styled.label`
  display: flex;
  margin-top: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.contextWhite};
  cursor: text;
  transition: box-shadow 150ms;

  ${({ error, focused, theme }) => `
    color: ${theme.colors.contextBlack};
    ${error ? `box-shadow: 0 0 0 1px ${theme.colors.errorTextRed}` : ``};
    ${focused ? `box-shadow: 0 0 0 1px ${theme.colors.contextBlue}` : ``};
  `};
`;

const PreInputNumberCode = styled.div`
  padding: 18px 13px 18px 16px;
  line-height: 20px;
  font-size: 17px;
  letter-spacing: -0.41px;

  ${({ isFilled, theme }) => `
    color: ${isFilled ? theme.colors.contextBlack : theme.colors.contextGrey};
  `};
`;

const PhoneInput = styled(Input)`
  ${is('isCode')`
    padding-left: 0;
  `};
`;

export default class Phone extends PureComponent {
  static propTypes = {
    phoneNumber: PropTypes.string.isRequired,
    openedFrom: PropTypes.string,
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    setPhoneNumber: PropTypes.func.isRequired,
    setScreenId: PropTypes.func.isRequired,
    setLocationData: PropTypes.func.isRequired,
    locationData: PropTypes.shape({
      code: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      countryCode: PropTypes.string.isRequired,
    }).isRequired,
    fetchRegFirstStep: PropTypes.func.isRequired,
    isLoadingFirstStep: PropTypes.bool.isRequired,
    sendPhoneError: PropTypes.string.isRequired,
    firstStepStopLoader: PropTypes.func.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
    nextSmsRetry: PropTypes.number.isRequired,
  };

  static defaultProps = {
    openedFrom: '',
  };

  state = {
    phoneNumber: '',
    phoneNumberError: '',
    locationDataError: '',
    isInputWrapperFocused: false,
  };

  phoneInputRef = createRef();

  componentDidMount() {
    const { phoneNumber } = this.props;
    if (phoneNumber) {
      this.setState({ phoneNumber });
    }
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
      locationData,
      fetchRegFirstStep,
      isLoadingFirstStep,
      firstStepStopLoader,
    } = this.props;
    const { phoneNumber } = this.state;

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

    try {
      const fullPhoneNumber = `+${locationData.code}${phoneNumber.replace(/[^0-9]+/g, '')}`;
      // it will be returned after request on incorrect step
      const screenId = await fetchRegFirstStep(fullPhoneNumber);
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
      this.setState({ phoneNumber: currentPhoneNumber, phoneNumberError: '' });
    }
  };

  replaceWithLoginModal = async () => {
    const { openedFrom, openModal, close } = this.props;

    if (openedFrom === OPENED_FROM_LOGIN) {
      await close({ status: MODAL_CANCEL });
      openModal(SHOW_MODAL_LOGIN);
    } else {
      close({ status: MODAL_CANCEL });
    }
  };

  phoneInputBlured = () => {
    this.setPhoneNumberInStore();
    this.setState({ isInputWrapperFocused: false });
  };

  phoneInputFocused = () => {
    this.setState({ isInputWrapperFocused: true });
  };

  render() {
    const { locationData, isLoadingFirstStep, sendPhoneError, setLocationData } = this.props;
    const { phoneNumber, phoneNumberError, locationDataError, isInputWrapperFocused } = this.state;
    const { code } = locationData;

    return (
      <>
        {isLoadingFirstStep && <CircleLoader />}
        <SubTitle>Enter your phone number</SubTitle>
        <DataInWrapper>
          <CountryChooser
            phoneInputRef={this.phoneInputRef}
            locationData={locationData}
            locationDataError={locationDataError}
            setLocationData={setLocationData}
            resetLocDataError={this.resetLocDataError}
          />
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
              onFocus={this.phoneInputFocused}
              onKeyDown={this.enterKeyDown}
              onChange={this.enterPhoneNumber}
              onBlur={this.phoneInputBlured}
            />
          </PhoneInputWrapper>
          <ErrorText>{locationDataError || phoneNumberError || sendPhoneError}</ErrorText>
        </DataInWrapper>
        <SendButton className="js-VerificationCodeSend" onClick={this.checkPhoneData}>
          Send verification code
        </SendButton>
        <BackButton className="js-VerificationCodeBack" onClick={this.replaceWithLoginModal}>
          Back
        </BackButton>
      </>
    );
  }
}
