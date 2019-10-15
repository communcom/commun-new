import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Captcha from 'react-google-recaptcha';
import { CAPTCHA_KEY } from 'shared/constants';

const CaptchaStyled = styled(Captcha).attrs({
  sitekey: CAPTCHA_KEY,
})`
  align-self: center;
  max-width: 100%;
  overflow: hidden;
`;

export default function Recaptcha({ onCaptchaChange, ...props }) {
  if (!CAPTCHA_KEY) {
    return <div>CAPTCHA_KEY is not set</div>;
  }

  return <CaptchaStyled onChange={onCaptchaChange} {...props} />;
}

Recaptcha.propTypes = {
  onCaptchaChange: PropTypes.func.isRequired,
};
