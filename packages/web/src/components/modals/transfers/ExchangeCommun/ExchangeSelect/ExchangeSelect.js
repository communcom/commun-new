/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

import TokensCarousel from 'components/modals/transfers/ExchangeCommun/common/TokensCarousel';
import { up } from '@commun/ui';
import is from 'styled-is';
import {
  ButtonStyled,
  Error,
  InputGroup,
  InputStyled,
  RateInfo,
} from 'components/modals/transfers/common.styled';
import BuyPointItem from 'components/modals/transfers/BuyPointItem';
import { sanitizeAmount, validateAmount, validateAmountToken } from 'utils/validatingInputs';
import { displayError } from 'utils/toastsMessages';
import Header from 'components/modals/transfers/ExchangeCommun/common/Header/Header.connect';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  width: 100%;

  background-color: ${({ theme }) => theme.colors.blue};

  ${up.mobileLandscape} {
    width: 350px;
  }
`;

const Token = styled.div``;

const TokenCarousel = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;

  margin-bottom: 20px;
`;

const TotalTokens = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: ${({ isSwapEnabled }) => (isSwapEnabled ? 40 : 20)}px;
`;

const TotalBalanceTitle = styled.p`
  margin-bottom: 5px;

  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const TotalBalanceCount = styled.p`
  font-size: 30px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;

  position: relative;
  padding: 20px 15px;
  padding-top: ${({ isSwapEnabled }) => (isSwapEnabled ? 40 : 20)}px;

  height: 356px;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 25px 25px 0 0;
  z-index: 999;

  ${up.mobileLandscape} {
    border-radius: 25px 25px 25px 25px;
  }
`;

// const SwapIconStyled = styled(Glyph).attrs({ icon: 'swap', size: 'medium' })``;
//
// const SwapAction = styled.div`
//   position: absolute;
//   top: -25px;
//
//   border: 2px solid white;
//   border-radius: 50%;
//
//   cursor: pointer;
// `;

const Footer = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;
  padding: 0 15px 30px;

  width: 100%;
  min-height: 70px;

  background-color: ${({ theme }) => theme.colors.white};

  ${up.mobileLandscape} {
    padding: 10px 16px;

    background-color: ${({ theme }) => theme.colors.blue};
    border-radius: 0 0 25px 25px;

    ${is('isDisabled')`
      background-color: ${({ theme }) => theme.colors.gray};
    `};

    &::before {
      position: absolute;
      top: -25px;

      width: 100%;
      height: 25px;

      content: '';
      background-color: ${({ theme }) => theme.colors.blue};
      z-index: 1;

      ${is('isDisabled')`
        background-color: ${({ theme }) => theme.colors.gray};
      `};
    }
  }
`;

const AmountGroup = styled.div`
  display: flex;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const ErrorWrapper = styled.div`
  margin-bottom: 5px;

  width: 100%;
`;

const CTA = styled.div`
  font-weight: bold;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.white};
`;

const Fee = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};

  opacity: 0.7;
`;

export default class ExchangeSelect extends PureComponent {
  static propTypes = {
    exchangeCurrencies: PropTypes.arrayOf(PropTypes.object),
    exchangeType: PropTypes.string,
    sellToken: PropTypes.object,
    buyToken: PropTypes.object,
    isMobile: PropTypes.bool,

    openModalSelectToken: PropTypes.func.isRequired,
    getExchangeCurrenciesFull: PropTypes.func.isRequired,
    getMinAmount: PropTypes.func.isRequired,
    getExchangeAmount: PropTypes.func.isRequired,
    createTransaction: PropTypes.func.isRequired,

    setCurrentScreen: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    exchangeCurrencies: [],
    exchangeType: 'BUY',
    sellToken: null,
    buyToken: null,
    isMobile: false,
  };

  state = {
    exchangeType: this.props.exchangeType,

    rate: null,

    sellMinAmount: null,
    buyMinAmount: null,

    sellAmount: null,
    buyAmount: null,

    sellToken: this.props.sellToken,
    buyToken: this.props.buyToken,

    sellAmountError: null,
    buyAmountError: null,
  };

  calculatePrice = throttle(async type => {
    const { exchangeType, getExchangeAmount } = this.props;
    const { sellToken, buyToken, sellMinAmount, buyMinAmount, sellAmount, buyAmount } = this.state;

    if (type === 'SELL') {
      if (!sellAmount) {
        return;
      }

      try {
        const buyAmountPrice = await getExchangeAmount({
          from: sellToken.name,
          to: buyToken.name,
          amount: sellAmount,
        });

        let buyAmountError = null;
        if (exchangeType !== 'SELL') {
          buyAmountError = validateAmountToken(buyAmountPrice, buyMinAmount);
        } else {
          buyAmountError = validateAmount(buyAmountPrice, buyToken);
        }

        this.setState({
          rate: buyAmountPrice / sellAmount,
          buyAmount: buyAmountPrice,
          buyAmountError,
        });
      } catch (err) {
        displayError("Can't get exchange amount");
      }
    } else {
      if (!buyAmount) {
        return;
      }

      try {
        const sellAmountPrice = await getExchangeAmount({
          from: buyToken.name,
          to: sellToken.name,
          amount: buyAmount,
        });

        let sellAmountError = null;
        if (exchangeType !== 'SELL') {
          sellAmountError = validateAmountToken(sellAmountPrice, sellMinAmount);
        } else {
          sellAmountError = validateAmount(sellAmountPrice, sellToken);
        }

        this.setState({
          rate: buyAmount / sellAmount,
          sellAmount: sellAmountPrice,
          sellAmountError,
        });
      } catch (err) {
        displayError("Can't get exchange amount");
      }
    }
  }, 500);

  componentDidMount() {
    const { getExchangeCurrenciesFull } = this.props;

    getExchangeCurrenciesFull();

    this.calculateMinAmount();
  }

  inputChangeHandler = type => e => {
    const { exchangeType } = this.props;

    let amount = sanitizeAmount(e.target.value);

    if (amount === '.') {
      amount = '0.';
    }

    let amountError = null;
    if (exchangeType !== 'SELL') {
      const minAmount = this.state[`${type}MinAmount`];
      amountError = validateAmountToken(amount, minAmount);
    } else {
      const token = this.state[`${type}Token`];
      amountError = validateAmount(amount, token);
    }

    this.setState(
      {
        [`${type}Amount`]: amount,
        [`${type}AmountError`]: amountError,
      },
      () => {
        this.calculatePrice(type.toUpperCase());
      }
    );
  };

  onTokenSelectClick = async () => {
    const { openModalSelectToken, exchangeCurrencies } = this.props;
    const tokenName = await openModalSelectToken({ tokens: exchangeCurrencies });

    if (tokenName) {
      this.onSelectToken({ name: tokenName });
    }
  };

  onExchangeClick = async () => {
    const { createTransaction, setCurrentScreen } = this.props;
    const { sellToken, buyToken, sellAmount } = this.state;

    try {
      // TODO: temp
      const result = await createTransaction({
        from: sellToken.name,
        to: buyToken.name,
        amount: sellAmount,
        address: '0xD5272cFb37a19e9B24749b7c0263D9F5CaE9246F',
      });

      setCurrentScreen({ id: 1, props: result });
    } catch (err) {
      displayError("Can't create transaction");
    }
  };

  onSelectToken = sellToken => {
    this.setState(
      {
        sellToken,
      },
      () => {
        this.calculateMinAmount();
        this.calculatePrice('BUY');
      }
    );
  };

  async calculateMinAmount() {
    const { getMinAmount } = this.props;
    const { exchangeType, sellToken, buyToken } = this.state;

    if (exchangeType !== 'SELL') {
      try {
        const sellMinAmount = await getMinAmount({ from: sellToken.name, to: buyToken.name });

        this.setState({
          sellMinAmount,
        });
      } catch (err) {
        displayError("Can't get min amount");
      }
    }
  }

  renderBuyTokenItem = () => {
    const { exchangeType, buyToken, sellToken } = this.state;

    if (exchangeType === 'SELL') {
      return <BuyPointItem point={sellToken} onSelectClick={this.onTokenSelectClick} />;
    }

    return <BuyPointItem point={buyToken} />;
  };

  renderBody() {
    const {
      rate,
      buyToken,
      sellToken,
      sellAmount,
      buyAmount,
      sellAmountError,
      buyAmountError,
    } = this.state;

    return (
      <InputGroup>
        {this.renderBuyTokenItem()}
        <AmountGroup>
          <InputStyled
            title={`You send ${sellToken.name}`}
            value={sellAmount}
            isError={Boolean(sellAmountError)}
            disabled={!sellToken || !buyToken}
            onChange={this.inputChangeHandler('sell')}
          />
          <InputStyled
            title={`You get ${buyToken.name}`}
            value={buyAmount}
            isError={Boolean(buyAmountError)}
            disabled={!sellToken || !buyToken}
            onChange={this.inputChangeHandler('buy')}
          />
        </AmountGroup>
        <ErrorWrapper>
          <Error>{sellAmountError || buyAmountError}</Error>
        </ErrorWrapper>
        {buyToken && rate > 0 && (
          <RateInfo>
            Rate: 1 {sellToken.name} = {rate} {buyToken.name}
          </RateInfo>
        )}
      </InputGroup>
    );
  }

  render() {
    const { isMobile, exchangeCurrencies, close } = this.props;
    const {
      sellToken,
      buyToken,
      sellAmount,
      buyAmount,
      sellAmountError,
      buyAmountError,
    } = this.state;

    const isSubmitButtonDisabled =
      !buyToken || !sellAmount || !buyAmount || sellAmountError || buyAmountError;

    return (
      <>
        <Header onTokenSelectClick={this.onTokenSelectClick} close={close} />
        <Wrapper>
          <Token>
            <TokenCarousel>
              <TokensCarousel tokens={exchangeCurrencies} onSelectToken={this.onSelectToken} />
            </TokenCarousel>
            <TotalTokens isSwapEnabled={false}>
              <TotalBalanceTitle>{sellToken.name}</TotalBalanceTitle>
              <TotalBalanceCount>{sellToken.fullName}</TotalBalanceCount>
            </TotalTokens>
          </Token>
          <Body isSwapEnabled={false}>
            {this.renderBody()}

            {isMobile ? (
              <ButtonStyled
                primary
                fluid
                disabled={isSubmitButtonDisabled}
                onClick={this.onExchangeClick}
              >
                Continue
              </ButtonStyled>
            ) : null}
          </Body>

          {!isMobile ? (
            <Footer isDisabled={isSubmitButtonDisabled} onClick={this.onExchangeClick}>
              <CTA>
                Convert: {sellAmount || 0} {sellToken.name}
                <Fee>Commission: 0.5%</Fee>
              </CTA>
            </Footer>
          ) : null}
        </Wrapper>
      </>
    );
  }
}
