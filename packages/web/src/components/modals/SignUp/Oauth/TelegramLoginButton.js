import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  z-index: 99;
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

    script.onload = () => {
      setTimeout(() => {
        const iframe = document.querySelector('[id^=telegram-login]');

        if (iframe) {
          iframe.setAttribute('style', 'border: none; overflow: hidden; heigth: 49px; width: 100%');
        }

        const tgButton = document.getElementsByClassName('tgme_widget_login_button');

        if (tgButton.length === 1) {
          tgButton[0].textContent = '';
          tgButton[0].setAttribute(
            'style',
            'width: 19em; height: 3em; background-color: transparent'
          );
        }
      }, 0);
    };

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
