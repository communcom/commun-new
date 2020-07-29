import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
  display: none;
`;

class TelegramLoginButton extends PureComponent {
  componentDidMount() {
    const { lang } = this.props;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?10';
    // TODO set bot name
    script.setAttribute('data-telegram-login', 'CommunDev_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '6');

    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-lang', lang);
    script.setAttribute('data-auth-url', '/auth/telegram');
    script.async = true;

    this.instance.appendChild(script);
  }

  render() {
    const { className, children } = this.props;

    return (
      <ButtonWrapper
        className={className}
        ref={component => {
          this.instance = component;
        }}
      >
        {children}
      </ButtonWrapper>
    );
  }
}

TelegramLoginButton.propTypes = {
  lang: PropTypes.string,
};

TelegramLoginButton.defaultProps = {
  lang: 'en',
};

export default TelegramLoginButton;
