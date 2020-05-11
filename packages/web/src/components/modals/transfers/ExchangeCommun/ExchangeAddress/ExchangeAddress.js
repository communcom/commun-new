import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { withTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { EXCHANGE_MODALS } from 'components/modals/transfers/ExchangeCommun/constants';
import { ButtonStyled } from 'components/modals/transfers/common.styled';
import Header from 'components/modals/transfers/common/Header/Header.connect';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.blue};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-top: 16px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 428px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.white};

  margin-bottom: 30px;
`;

const WrapperQR = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 280px;
`;
const QRCodeImg = styled.img`
  width: 175px;
  height: 175px;
`;

const Delimeter = styled.div`
  position: relative;
  height: 24px;

  &::before {
    position: absolute;
    content: '';
    top: 11px;
    left: 27px;
    right: 27px;
    height: 2px;
    border-bottom: 2px dashed #e2e6e8;
  }
`;
const Circle = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.blue};

  ${is('left')`
    left: -12px;
  `};

  ${is('right')`
    right: -12px;
  `};
`;
const WrapperKey = styled.div`
  padding: 10px 30px 15px;
  text-align: center;
  overflow-wrap: break-word;
`;
const Title = styled.span`
  font-weight: 600;
  font-size: 12px;
  color: #a5a7bd;
`;
const Text = styled.div`
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.black};
`;

const ButtonCopy = styled(ButtonStyled)`
  background: rgba(255, 255, 255, 0.1);
`;

const ButtonBack = styled.button.attrs({ type: 'button' })`
  padding: 18px 0 12px;
  font-weight: bold;
  font-size: 14px;
  line-height: 100%;
  color: #fff;
`;

function generateQr(str) {
  return new Promise((resolve, reject) => {
    let QRCode = null;

    if (process.browser) {
      // eslint-disable-next-line global-require
      QRCode = require('qrcode');
    }

    QRCode.toDataURL(str, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

@withTranslation()
export default class ExchangeAddress extends PureComponent {
  static propTypes = {
    currencyFrom: PropTypes.string.isRequired,
    amountExpectedFrom: PropTypes.string.isRequired,
    payinAddress: PropTypes.string.isRequired,
    payinExtraId: PropTypes.string.isRequired,

    setCurrentScreen: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  state = {
    qrcode: null,
  };

  async componentDidMount() {
    const { payinAddress } = this.props;

    const qrcode = await generateQr(payinAddress);

    this.setState({
      qrcode,
    });
  }

  onCopyClick = () => {
    const { payinAddress, t } = this.props;

    const tempInput = document.createElement('input');
    tempInput.style = 'position: absolute; left: -1000px; top: -1000px';
    tempInput.value = payinAddress;
    document.body.appendChild(tempInput);
    tempInput.select();

    let isCopied = false;
    try {
      isCopied = document.execCommand('copy');
    } catch (err) {
      // catch
    }
    document.body.removeChild(tempInput);

    if (isCopied) {
      displaySuccess(t('modals.transfers.exchange_commun.address.toastsMessages.copied'));
    } else {
      // eslint-disable-next-line no-console
      console.error(t('modals.transfers.exchange_commun.address.toastsMessages.copy_failed'));
      displayError(t('modals.transfers.exchange_commun.address.toastsMessages.copy_failed'));
    }
  };

  onBackClick = () => {
    const { setCurrentScreen } = this.props;

    setCurrentScreen({ id: EXCHANGE_MODALS.EXCHANGE_SELECT, props: {} });
  };

  render() {
    const { currencyFrom, amountExpectedFrom, payinAddress, payinExtraId, close, t } = this.props;
    const { qrcode } = this.state;

    return (
      <Wrapper>
        <Header
          titleLocaleKey="modals.transfers.exchange_commun.common.header.title"
          close={close}
        />
        <Content>
          <Body>
            <WrapperQR>
              {qrcode ? (
                <QRCodeImg
                  src={qrcode}
                  alt={t('modals.transfers.exchange_commun.address.qr_code')}
                />
              ) : null}
            </WrapperQR>
            <Delimeter>
              <Circle left />
              <Circle right />
            </Delimeter>
            <WrapperKey>
              <Title>
                {t('modals.transfers.exchange_commun.address.send')} {currencyFrom.toUpperCase()}:
              </Title>
              <Text>{amountExpectedFrom}</Text>
              {payinExtraId ? (
                <>
                  <Title>{t('modals.transfers.exchange_commun.address.tag')}:</Title>
                  <Text>{payinExtraId}</Text>
                </>
              ) : null}
              <Title>{t('modals.transfers.exchange_commun.address.address_field')}:</Title>
              <Text>{payinAddress}</Text>
            </WrapperKey>
          </Body>
          <ButtonCopy primary fluid onClick={this.onCopyClick}>
            {t('modals.transfers.exchange_commun.address.copy')}
          </ButtonCopy>
          <ButtonBack onClick={this.onBackClick}>{t('common.back')}</ButtonBack>
        </Content>
      </Wrapper>
    );
  }
}
