import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { ButtonStyled } from 'components/modals/transfers/common.styled';
import { displaySuccess } from 'utils/toastsMessages';
import Header from 'components/modals/transfers/ExchangeCommun/common/Header/Header.connect';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.blue};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-top: 31px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 428px;
  border-radius: 20px;
  background: #ffffff;

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
  color: #000000;
`;

const ButtonCopy = styled(ButtonStyled)`
  background: rgba(255, 255, 255, 0.1);
`;

const ButtonBack = styled.button.attrs({ type: 'button' })`
  padding: 18px 0 12px;
  font-weight: bold;
  font-size: 14px;
  line-height: 100%;
  color: #ffffff;
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
    const { payinAddress } = this.props;

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
      displaySuccess('Address was copied');
    } else {
      displaySuccess('Unable to copy address');
    }
  };

  onBackClick = () => {
    const { setCurrentScreen } = this.props;

    setCurrentScreen({ id: 0, props: {} });
  };

  render() {
    const { currencyFrom, amountExpectedFrom, payinAddress, payinExtraId, close } = this.props;
    const { qrcode } = this.state;

    return (
      <Wrapper>
        <Header close={close} />
        <Content>
          <Body>
            <WrapperQR>{qrcode ? <QRCodeImg src={qrcode} alr="QR code" /> : null}</WrapperQR>
            <Delimeter>
              <Circle left />
              <Circle right />
            </Delimeter>
            <WrapperKey>
              <Title>Send {currencyFrom.toUpperCase()}:</Title>
              <Text>{amountExpectedFrom}</Text>
              {payinExtraId ? (
                <>
                  <Title>Tag:</Title>
                  <Text>{payinExtraId}</Text>
                </>
              ) : null}
              <Title>Address:</Title>
              <Text>{payinAddress}</Text>
            </WrapperKey>
          </Body>
          <ButtonCopy primary fluid onClick={this.onCopyClick}>
            Copy
          </ButtonCopy>
          <ButtonBack onClick={this.onBackClick}>Back</ButtonBack>
        </Content>
      </Wrapper>
    );
  }
}
