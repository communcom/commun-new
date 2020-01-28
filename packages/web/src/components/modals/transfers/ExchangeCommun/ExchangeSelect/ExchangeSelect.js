/* eslint-disable react/destructuring-assignment,no-console */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash.throttle';

import {
  sanitizeAmount,
  validateAmount,
  validateAmountCarbon,
  validateAmountToken,
  validateEmail,
} from 'utils/validatingInputs';
import { displayError } from 'utils/toastsMessages';

import { CircleLoader } from '@commun/ui';
import {
  ButtonStyled,
  ErrorWrapper,
  Error,
  InputGroup,
  InputStyled,
} from 'components/modals/transfers/common.styled';
import { Wrapper, Content } from 'components/modals/transfers/ExchangeCommun/common.styled';
import SellTokenItem from 'components/modals/transfers/SellTokenItem';
import Header from 'components/modals/transfers/ExchangeCommun/common/Header/Header.connect';
import BillingInfoBlock from 'components/modals/transfers/ExchangeCommun/common/BillingInfoBlock';
import InfoField from 'components/modals/transfers/ExchangeCommun/common/InfoField';

const SellTokenItemStyled = styled(SellTokenItem)`
  border: none;
`;

const Hint = styled.span`
  visibility: hidden;
  display: inline-block;
  margin: 5px 0 20px;
  padding: 0 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};

  ${is('isShow')`
    visibility: visible;
  `}
`;

const TitleGroup = styled.div`
  margin: 0 0 10px 10px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.gray};
`;

const InputGroupStyled = styled(InputGroup)`
  display: inline-block;

  & > * {
    margin-top: 1px;
    border-radius: 0;

    &:nth-child(2) {
      margin-top: 0;
      border-radius: 10px 10px 0 0;
    }

    &:last-child {
      border-radius: 0 0 10px 10px;
    }
  }
`;

const RateInfo = styled.span`
  visibility: hidden;
  display: inline-block;
  width: 100%;
  margin: 10px 0 20px;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};

  ${is('isShow')`
    visibility: visible;
  `}
`;

export default class ExchangeSelect extends PureComponent {
  static propTypes = {
    currentUserId: PropTypes.string.isRequired,
    exchangeType: PropTypes.string,
    sellToken: PropTypes.object,
    buyToken: PropTypes.object,
    showTokenSelect: PropTypes.bool,

    openModalSelectToken: PropTypes.func.isRequired,
    getMinMaxAmount: PropTypes.func.isRequired,
    getExchangeAmount: PropTypes.func.isRequired,
    createTransaction: PropTypes.func.isRequired,
    getOrCreateClient: PropTypes.func.isRequired,
    getRates: PropTypes.func.isRequired,

    setCurrentScreen: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    exchangeType: 'BUY',
    sellToken: null,
    buyToken: null,
    showTokenSelect: true,
  };

  state = {
    exchangeType: this.props.exchangeType,

    rate: null,

    sellMinAmount: null,
    buyMinAmount: null,

    sellMaxAmount: null,
    buyMaxAmount: null,

    sellAmount: null,
    buyAmount: 0,

    sellToken: this.props.sellToken,
    buyToken: this.props.buyToken,

    sellAmountError: null,
    buyAmountError: null,

    email: '',
    emailError: null,

    isLoading: false,
  };

  calculatePrice = throttle(
    async type => {
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
          let buyAmountError = null;

          // check only exists after edit
          if (exchangeType === 'BUY') {
            buyAmountError = validateAmountToken(sellAmount);
          } else {
            buyAmountError = validateAmount(sellAmount);
          }

          this.setState({
            buyAmountError,
          });

          const buyAmountPrice = await getExchangeAmount({
            from: sellToken.symbol,
            to: buyToken.symbol,
            amount: sellAmount,
          });

          // check all variants
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
          let sellAmountError = null;

          // check only exists after edit
          if (exchangeType === 'BUY') {
            sellAmountError = validateAmountToken(buyAmount);
          } else {
            sellAmountError = validateAmount(buyAmount);
          }

          this.setState({
            sellAmountError,
          });

          const sellAmountPrice = await getExchangeAmount({
            from: buyToken.symbol,
            to: sellToken.symbol,
            amount: buyAmount,
          });

          // check all variants
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
    },
    500,
    { leading: false }
  );

  componentDidMount() {
    const { showTokenSelect } = this.props;

    this.fetchMinAmount();

    if (showTokenSelect) {
      this.tokenSelect();
    }
  }

  inputChangeHandler = type => e => {
    const { exchangeType } = this.props;
    const { sellToken } = this.state;

    let amount = sanitizeAmount(e.target.value);

    if (amount === '.') {
      amount = '0.';
    }

    if (sellToken.symbol === 'USD') {
      let amountError = null;
      if (exchangeType === 'BUY') {
        const minAmount = 5.0;
        const maxAmount = this.state[`${type}MaxAmount`];
        amountError = validateAmountCarbon(amount, minAmount, maxAmount);
      }

      this.setState(
        {
          [`${type}Amount`]: amount,
          [`${type}AmountError`]: amountError,
        },
        () => {
          // this.calculatePrice(type.toUpperCase());
        }
      );
    } else {
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
    }
  };

  tokenSelect = async () => {
    const { openModalSelectToken } = this.props;

    const token = await openModalSelectToken();

    if (token) {
      this.onSelectToken(token);
    }
  };

  buyByCard = async () => {
    const { getOrCreateClient, setCurrentScreen } = this.props;
    const { email, sellAmount } = this.state;

    try {
      const result = await getOrCreateClient({ email });

      setCurrentScreen({
        id: 2,
        props: {
          contactId: result.details.contactId,
          publicKey: result.publicKey || result.details.publicKey,
          amount: sellAmount,
        },
      });
    } catch (err) {
      const message = err.data?.message || 'Something went wrong';
      displayError(message);
    }
  };

  async buyByToken() {
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
  }

  onExchangeClick = async () => {
    const { sellToken } = this.state;

    if (sellToken.symbol === 'USD') {
      this.buyByCard();
    } else {
      this.buyByToken();
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
    const { getMinMaxAmount, getRates } = this.props;
    const { exchangeType, sellToken, buyToken } = this.state;

    if (sellToken.symbol === 'USD') {
      this.setState({ isLoading: true });
      const result = await getRates();
      this.setState({
        isLoading: false,
        rate: Number(result.commun['usd/commun']),
        sellAmount: 5.0,
        sellMinAmount: 5.0,
        buyMaxAmount: Number(result.commun.max),
      });
    } else if (exchangeType === 'BUY') {
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

  inputChangeEmail = e => {
    const { value } = e.target;

    let emailError = null;

    if (!validateEmail(value)) {
      emailError = 'Email has incorrect format';
    }

    this.setState({ email: value, emailError });
  };

  renderBody() {
    const {
      rate,
      buyToken,
      sellToken,
      sellAmount,
      sellMinAmount,
      buyAmount,
      sellAmountError,
      buyAmountError,
      email,
      emailError,
    } = this.state;

    const error = emailError || sellAmountError || buyAmountError;

    return (
      <>
        <InputGroupStyled>
          <TitleGroup>You Send</TitleGroup>
          <SellTokenItemStyled token={sellToken} onSelectClick={this.tokenSelect} />
          <InputStyled
            title="Amount"
            prefix={sellToken.symbol === 'USD' ? '$' : null}
            value={sellAmount}
            isError={Boolean(sellAmountError)}
            disabled={!sellToken || !buyToken}
            onChange={this.inputChangeHandler('sell')}
          />
        </InputGroupStyled>

        <Hint isShow={Boolean(sellMinAmount)}>
          Minimum charge is {sellMinAmount} {sellToken.symbol}
        </Hint>

        <InputGroupStyled>
          <TitleGroup>You Get</TitleGroup>
          <SellTokenItemStyled token={buyToken} />
          <InfoField left={`${buyAmount} ${buyToken.symbol}`} />
          {sellToken.symbol === 'USD' ? (
            <InputStyled
              type="email"
              title="Email"
              autocomplete="email"
              isError={Boolean(emailError)}
              value={email}
              onChange={this.inputChangeEmail}
            />
          ) : null}
        </InputGroupStyled>

        <RateInfo isShow={buyToken && rate > 0}>
          Rate: 1 {sellToken.symbol} = {rate} {buyToken.symbol}
        </RateInfo>

        {error ? (
          <ErrorWrapper>
            <Error>{error}</Error>
          </ErrorWrapper>
        ) : null}
      </>
    );
  }

  render() {
    const { close } = this.props;
    const {
      buyToken,
      sellToken,
      sellAmount,
      buyAmount,
      sellAmountError,
      buyAmountError,
      email,
      isLoading,
    } = this.state;

    const isSubmitButtonDisabled =
      !buyToken ||
      !sellAmount ||
      !buyAmount ||
      sellAmountError ||
      buyAmountError ||
      (sellToken.symbol === 'USD' && !email);

    return (
      <Wrapper>
        <Header isBlack close={close} />
        <Content>
          {this.renderBody()}

          <BillingInfoBlock
            showAgreement
            provider={sellToken.symbol === 'USD' ? 'Carbon' : 'ChangeHero'}
          />

          {isLoading ? <CircleLoader /> : null}

          <ButtonStyled
            primary
            fluid
            disabled={isSubmitButtonDisabled}
            onClick={this.onExchangeClick}
          >
            Buy commun
          </ButtonStyled>
        </Content>
      </Wrapper>
    );
  }
}
