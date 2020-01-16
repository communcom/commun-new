/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

import { up } from '@commun/ui';
import { sanitizeAmount, validateAmount, validateAmountToken } from 'utils/validatingInputs';
import { displayError } from 'utils/toastsMessages';

import {
  ButtonStyled,
  Error,
  InputGroup,
  InputStyled,
} from 'components/modals/transfers/common.styled';
import SellTokenItem from 'components/modals/transfers/SellTokenItem';
import Header from 'components/modals/transfers/ExchangeCommun/common/Header/Header.connect';
import ChangeHeroBlock from 'components/modals/transfers/ExchangeCommun/common/ChangeHeroBlock';
import InfoField from 'components/modals/transfers/ExchangeCommun/common/InfoField';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  width: 100%;

  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  ${up.mobileLandscape} {
    width: 350px;
  }
`;

const Content = styled.div`
  padding: 15px;
`;

const AgreeHint = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 100%;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
  margin-top: 15px;
`;

const TermsLink = styled.a`
  color: ${({ theme }) => theme.colors.black};
`;

const ErrorWrapper = styled.div`
  margin-bottom: 5px;

  width: 100%;
`;

const SellTokenItemStyled = styled(SellTokenItem)`
  border: none;
`;

const InputGroupStyled = styled(InputGroup)`
  margin-bottom: 10px;

  & > * {
    margin-top: 1px;
    border-radius: 0;

    &:first-child {
      margin-top: 0;
      border-radius: 10px 10px 0 0;
    }

    &:last-child {
      border-radius: 0 0 10px 10px;
    }
  }
`;

export default class ExchangeSelect extends PureComponent {
  static propTypes = {
    currentUserId: PropTypes.string.isRequired,
    exchangeCurrencies: PropTypes.arrayOf(PropTypes.object),
    exchangeType: PropTypes.string,
    sellToken: PropTypes.object,
    buyToken: PropTypes.object,

    openModalSelectToken: PropTypes.func.isRequired,
    getExchangeCurrenciesFull: PropTypes.func.isRequired,
    getMinMaxAmount: PropTypes.func.isRequired,
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
  };

  state = {
    exchangeType: this.props.exchangeType,

    rate: null,

    sellMinAmount: null,
    buyMinAmount: null,

    buyMaxAmount: null,

    sellAmount: null,
    buyAmount: null,

    sellToken: this.props.sellToken,
    buyToken: this.props.buyToken,

    sellAmountError: null,
    buyAmountError: null,
  };

  calculatePrice = throttle(async type => {
    const { exchangeType, getExchangeAmount } = this.props;
    const {
      sellToken,
      buyToken,
      sellMinAmount,
      buyMinAmount,
      sellAmount,
      buyAmount,
      buyMaxAmount,
    } = this.state;

    if (type === 'SELL') {
      if (!sellAmount) {
        return;
      }

      try {
        const buyAmountPrice = await getExchangeAmount({
          from: sellToken.symbol,
          to: buyToken.symbol,
          amount: sellAmount,
        });

        let buyAmountError = null;
        if (exchangeType === 'BUY') {
          buyAmountError = validateAmountToken(buyAmountPrice, buyMinAmount, buyMaxAmount);
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
          from: buyToken.symbol,
          to: sellToken.symbol,
          amount: buyAmount,
        });

        let sellAmountError = null;
        if (exchangeType === 'BUY') {
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

    this.fetchMinAmount();
  }

  inputChangeHandler = type => e => {
    const { exchangeType } = this.props;

    let amount = sanitizeAmount(e.target.value);

    if (amount === '.') {
      amount = '0.';
    }

    let amountError = null;
    if (exchangeType === 'BUY') {
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
    const { exchangeCurrencies, openModalSelectToken } = this.props;
    const tokenSymbol = await openModalSelectToken({ tokens: exchangeCurrencies });

    if (tokenSymbol) {
      const token = exchangeCurrencies.find(item => item.symbol === tokenSymbol);

      if (token) {
        this.onSelectToken(token);
      }
    }
  };

  onExchangeClick = async () => {
    const { currentUserId, createTransaction, setCurrentScreen } = this.props;
    const { sellToken, buyToken, sellAmount } = this.state;

    try {
      const result = await createTransaction({
        from: sellToken.symbol,
        to: buyToken.symbol,
        amount: sellAmount,
        address: currentUserId,
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
        this.fetchMinAmount();
      }
    );
  };

  async fetchMinAmount() {
    const { getMinMaxAmount } = this.props;
    const { exchangeType, sellToken, buyToken } = this.state;

    if (exchangeType !== 'SELL') {
      try {
        const { minFromAmount, maxToAmount } = await getMinMaxAmount({
          from: sellToken.symbol,
          to: buyToken.symbol,
        });

        this.setState(
          {
            sellAmount: Number(minFromAmount),
            sellMinAmount: Number(minFromAmount) || null,
            buyMaxAmount: Number(maxToAmount) || null,
          },
          () => {
            this.calculatePrice('SELL');
          }
        );
      } catch (err) {
        displayError("Can't get min amount");
      }
    }
  }

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
      <>
        <InputGroupStyled>
          <SellTokenItemStyled token={sellToken} onSelectClick={this.onTokenSelectClick} />
          <InputStyled
            title="Amount"
            value={sellAmount}
            isError={Boolean(sellAmountError)}
            disabled={!sellToken || !buyToken}
            onChange={this.inputChangeHandler('sell')}
          />
        </InputGroupStyled>

        <InputGroupStyled>
          {buyToken && rate > 0 && (
            <InfoField title="Rate" left={`1 ${sellToken.symbol} = ${rate} ${buyToken.symbol}`} />
          )}
          <InfoField title="You pay" left={`${sellAmount} ${sellToken.symbol}`} />
          <InfoField title="You get" left={`${buyAmount} ${buyToken.symbol}`} />
        </InputGroupStyled>
        <ErrorWrapper>
          <Error>{sellAmountError || buyAmountError}</Error>
        </ErrorWrapper>
      </>
    );
  }

  render() {
    const { close } = this.props;
    const { buyToken, sellAmount, buyAmount, sellAmountError, buyAmountError } = this.state;

    const isSubmitButtonDisabled =
      !buyToken || !sellAmount || !buyAmount || sellAmountError || buyAmountError;

    return (
      <Wrapper>
        <Header isBlack close={close} />
        <Content>
          {this.renderBody()}

          <ChangeHeroBlock />

          <AgreeHint>
            By clicking Convert, you agree to ChangeHero’s{' '}
            <TermsLink
              href="https://changehero.io/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
            >
              terms of service.
            </TermsLink>
          </AgreeHint>

          <ButtonStyled
            primary
            fluid
            disabled={isSubmitButtonDisabled}
            onClick={this.onExchangeClick}
          >
            Continue
          </ButtonStyled>
        </Content>
      </Wrapper>
    );
  }
}
