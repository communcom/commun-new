import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';
import debounce from 'lodash.debounce';
import CountryFlag from 'cyber-country-flag';
import { injectFeatureToggles } from '@flopflip/react-redux';

import { styles, KEY_CODES } from '@commun/ui';
import { FEATURE_REGISTRATION_ALL } from 'shared/featureFlags';
import { setRegistrationData } from 'utils/localStore';
import { checkPressedKey } from 'utils/keyPress';

import LazyLoad from 'components/common/LazyLoad';
import countriesCodes from './codesList';
import { Input } from '../commonStyled';

const COUNTIES_DROPDOWN_HEIGHT = 253;
const COUNTRY_ITEM_HEIGHT = 46;
const NO_CODE_MATCHES_OBJECT = {
  code: null,
  countryCode: 'No code',
  country: 'No country',
};

const CountryFlagWrapped = styled(CountryFlag)`
  height: 20px;
  margin-left: auto;
`;

const LocationDataChooser = styled.ul`
  position: absolute;
  z-index: 2;
  top: 104px;
  width: 100%;
  max-height: ${COUNTIES_DROPDOWN_HEIGHT}px;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  overflow: auto;
`;

const LocationDataWrapper = styled.li`
  display: flex;
  align-items: center;
  padding: 13px 16px;
  cursor: pointer;
  font-size: 17px;
  outline: none;
  transition: background-color 150ms;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }

  ${is('choosed')`
    background-color: ${({ theme }) => theme.colors.lightGray};
  `};

  ${isNot('isAvailable')`
    color: ${({ theme }) => theme.colors.gray};
  `};
`;

const Code = styled.p`
  flex-shrink: 0;
  width: 55px;
  line-height: 20px;
  font-weight: 400;
`;

const CodeInButton = styled(Code)`
  width: auto;
`;

const Country = styled.p`
  margin: 0 12px;
  line-height: 20px;
`;

const CountryInButton = styled(Country)`
  ${styles.overflowEllipsis};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  max-height: 56px;
  margin-top: 20px;
  border: 1px solid ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 8px;
  transition: border-color 0.15s;

  ${({ error, focused, theme }) => `
    ${
      error
        ? `
          border-color: ${theme.colors.errorTextRed};
        `
        : ``
    };
    ${
      focused
        ? `
          border-color: ${theme.colors.lightGray};
        `
        : ``
    };
  `};

  & input {
    padding: 17px 16px;
  }
`;

const InputPlaceholder = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  font-size: 17px;
  pointer-events: none;
`;

const ChooseCountryText = styled.p`
  margin-left: 1px;
  color: ${({ theme }) => theme.colors.gray};
`;

const NoSearchResults = styled.p`
  padding: 13px 16px;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.gray};
`;

@injectFeatureToggles([FEATURE_REGISTRATION_ALL])
export default class CountryChooser extends Component {
  static propTypes = {
    locationData: PropTypes.shape({
      code: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      countryCode: PropTypes.string.isRequired,
    }).isRequired,
    locationDataError: PropTypes.string,
    setLocationData: PropTypes.func.isRequired,
    resetLocDataError: PropTypes.func.isRequired,
    phoneInputRef: PropTypes.object,
    featureToggles: PropTypes.object.isRequired,
  };

  static defaultProps = {
    locationDataError: '',
    phoneInputRef: {},
  };

  state = {
    isChooserOpen: false,
    filteredCountriesCodes: [],
  };

  locationDataChooserRef = createRef();

  inputChooserRef = createRef();

  inputRef = createRef();

  filterCountries = debounce(value => {
    const { resetLocDataError } = this.props;

    const searchParam = value.toLowerCase();
    const filteredCountries = countriesCodes.filter(
      item =>
        item.country.toLowerCase().includes(searchParam) || `+${item.code}`.includes(searchParam)
    );
    if (searchParam.length && !filteredCountries.length) {
      filteredCountries.push(NO_CODE_MATCHES_OBJECT);
    }
    resetLocDataError();
    this.setState({ filteredCountriesCodes: filteredCountries });
  }, 500);

  componentWillUnmount() {
    this.filterCountries.cancel();
  }

  checkOutOfChooserClick = e => {
    if (this.inputChooserRef.current?.contains(e.target)) {
      return;
    }
    if (!this.locationDataChooserRef.current?.contains(e.target)) {
      this.closeChooser();
    }
  };

  openChooser = () => {
    const { isChooserOpen } = this.state;

    if (!isChooserOpen) {
      this.setState({ isChooserOpen: true });
      window.addEventListener('click', this.checkOutOfChooserClick, true);
    }
  };

  countryKeyDown = (e, code, country, countryCode, available) => {
    switch (checkPressedKey(e)) {
      case KEY_CODES.ENTER:
        this.chooseLocationData(code, country, countryCode, available);
        break;

      case KEY_CODES.DOWN: {
        e.preventDefault();
        e.stopPropagation();

        if (document.activeElement.nextSibling) {
          document.activeElement.nextSibling.focus();
        }
        break;
      }

      case KEY_CODES.UP: {
        e.preventDefault();
        e.stopPropagation();

        if (document.activeElement.previousSibling) {
          document.activeElement.previousSibling.focus();
        }
        break;
      }

      default:
        this.escKeyDown();
        break;
    }
  };

  escKeyDown = () => {
    this.setState({ isChooserOpen: false }, () => this.inputRef.current.blur());
    window.removeEventListener('click', this.checkOutOfChooserClick, true);
  };

  inputDownClick = e => {
    e.preventDefault();
    e.stopPropagation();

    if (this.locationDataChooserRef.current) {
      this.locationDataChooserRef.current.firstElementChild.focus();
    }
  };

  inputKeyDown = e => {
    switch (checkPressedKey(e)) {
      case KEY_CODES.ESC:
        this.escKeyDown();
        break;

      case KEY_CODES.DOWN:
        this.inputDownClick(e);
        break;

      default:
        break;
    }
  };

  chooseLocationData = (code, country, countryCode, available) => {
    const { setLocationData, locationData, phoneInputRef } = this.props;

    phoneInputRef.current.focus();
    if (locationData.country !== country) {
      setLocationData({
        code,
        country,
        countryCode,
        available,
      });
      setRegistrationData({
        locationData: {
          code,
          country,
          countryCode,
          available,
        },
      });
    }
    this.closeChooser();
  };

  closeChooser() {
    this.setState({ isChooserOpen: false, filteredCountriesCodes: [] });

    if (this.inputRef.current) {
      this.inputRef.current.value = '';
    }

    window.removeEventListener('click', this.checkOutOfChooserClick, true);
  }

  renderCountriesCodes() {
    const { locationData, featureToggles } = this.props;
    const { filteredCountriesCodes } = this.state;

    let codes = countriesCodes;
    if (filteredCountriesCodes.length) {
      codes = filteredCountriesCodes;
    }

    return codes.map(({ code, country, countryCode, available }) => {
      const countryAvailable = available || featureToggles[FEATURE_REGISTRATION_ALL];

      return code ? (
        <LazyLoad key={country} height={COUNTRY_ITEM_HEIGHT} offset={50}>
          <LocationDataWrapper
            key={country}
            tabIndex="0"
            choosed={locationData.country === country}
            onKeyDown={e => this.countryKeyDown(e, code, country, countryCode, countryAvailable)}
            onClick={() => this.chooseLocationData(code, country, countryCode, countryAvailable)}
            isAvailable={countryAvailable}
          >
            <Code>+{code}</Code>
            <Country>{country}</Country>
            <CountryFlagWrapped code={countryCode} />
          </LocationDataWrapper>
        </LazyLoad>
      ) : (
        <NoSearchResults key={country}>There&apos;s no matches found</NoSearchResults>
      );
    });
  }

  render() {
    const { locationData, locationDataError } = this.props;
    const { isChooserOpen } = this.state;
    const { code, country, countryCode } = locationData;

    const codeCountryButtonText = code ? (
      <>
        <CodeInButton>+{code}</CodeInButton>
        <CountryInButton>{country}</CountryInButton>
        <CountryFlagWrapped code={countryCode} />
      </>
    ) : (
      <ChooseCountryText>Choose country</ChooseCountryText>
    );

    return (
      <>
        <InputWrapper
          ref={this.inputChooserRef}
          name="country-chooser__input"
          error={locationDataError}
          onFocus={this.openChooser}
        >
          <Input
            ref={this.inputRef}
            maxLength="40"
            tabIndex="0"
            onKeyDown={this.inputKeyDown}
            onChange={e => this.filterCountries(e.target.value)}
          />
          {!isChooserOpen && <InputPlaceholder>{codeCountryButtonText}</InputPlaceholder>}
        </InputWrapper>
        {isChooserOpen && (
          <LocationDataChooser ref={this.locationDataChooserRef} className="js-LocDataChooser">
            {this.renderCountriesCodes()}
          </LocationDataChooser>
        )}
      </>
    );
  }
}
