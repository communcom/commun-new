/* eslint-disable react/destructuring-assignment,no-console */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash.throttle';

import { withTranslation } from 'shared/i18n';
import {
  sanitizeAmount,
  validateAmountCarbon,
  validateAmountToken,
  validateEmail,
} from 'utils/validatingInputs';
import { displayError } from 'utils/toastsMessages';

import { SplashLoader } from '@commun/ui';
import {
  ButtonStyled,
  ErrorWrapper,
  Error,
  InputGroup,
  InputStyled,
} from 'components/modals/transfers/common.styled';
import { EXCHANGE_MODALS } from 'components/modals/transfers/ExchangeCommun/constants';
import { Wrapper, Content } from 'components/modals/transfers/ExchangeCommun/common.styled';
import SellTokenItem from 'components/modals/transfers/ExchangeCommun/ExchangeSelect/common/SellTokenItem';
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

const InfoFieldStyled = styled(InfoField)`
  margin-top: 16px;
  border-radius: 10px;
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

const CARBON_MIN_USD = 5.0;

@withTranslation()
export default class ExchangeSelect extends PureComponent {
  static propTypes = {
    currentUserId: PropTypes.string.isRequired,
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
    sellToken: null,
    buyToken: null,
    showTokenSelect: true,
  };

  state = {
    rate: null,
    fee: null,

    sellMinAmount: null,
    buyMinAmount: null,

    sellMaxAmount: null,
    buyMaxAmount: null,

    sellAmount: undefined,
    buyAmount: 0,

    sellToken: this.props.sellToken,
    buyToken: this.props.buyToken,

    sellAmountError: null,
    buyAmountError: null,

    email: '',
    emailError: null,

    isLoading: false,
  };

  getRatesCarbon = async ({ sellAmount }) => {
    const { getRates } = this.props;

    this.setState({ isLoading: true, sellAmount });

    let result;
    let newState = {};

    try {
      const amount = sellAmount * 100;
      result = await getRates({
        fiatBaseCurrency: 'usd',
        fiatChargeAmount: amount,
      });

      newState = {
        rate: Number(result.commun['usd/commun']),
        fee: result.commun.txFee,
        sellMinAmount: CARBON_MIN_USD,
        buyAmount: result.commun.estimatedCryptoPurchase,
        buyMaxAmount: Number(result.commun.max),
      };
    } catch (err) {
      const message = err.data?.message || 'Something went wrong';
      displayError(message);

      newState.sellAmountError = message;
    }

    this.setState({
      ...newState,
      isLoading: false,
    });
  };

  calculatePrice = throttle(
    async type => {
      const { getExchangeAmount } = this.props;
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

        if (sellToken.symbol === 'USD') {
          this.getRatesCarbon({ sellAmount });
        } else {
          try {
            // check only exists after edit
            let buyAmountError = validateAmountToken(sellAmount);

            this.setState({
              buyAmountError,
            });

            const buyAmountPrice = await getExchangeAmount({
              from: sellToken.symbol,
              to: buyToken.symbol,
              amount: sellAmount,
            });

            // check all variants
            buyAmountError = validateAmountToken(buyAmountPrice, buyMinAmount, buyMaxAmount);

            this.setState({
              rate: buyAmountPrice / sellAmount,
              buyAmount: buyAmountPrice,
              buyAmountError,
            });
          } catch (err) {
            displayError("Can't get exchange amount");
          }
        }
      } else {
        if (!buyAmount) {
          return;
        }

        try {
          // check only exists after edit
          let sellAmountError = validateAmountToken(buyAmount);

          this.setState({
            sellAmountError,
          });

          const sellAmountPrice = await getExchangeAmount({
            from: buyToken.symbol,
            to: sellToken.symbol,
            amount: buyAmount,
          });

          // check all variants
          sellAmountError = validateAmountToken(sellAmountPrice, sellMinAmount);

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
    const { sellToken } = this.state;

    let amount = sanitizeAmount(e.target.value);

    if (amount === '.') {
      amount = '0.';
    }

    if (sellToken.symbol === 'USD') {
      const minAmount = 5.0;
      const maxAmount = this.state[`${type}MaxAmount`];
      const amountError = validateAmountCarbon(amount, minAmount, maxAmount);

      this.setState(
        {
          [`${type}Amount`]: amount,
          [`${type}AmountError`]: amountError,
        },
        () => {
          this.calculatePrice(type.toUpperCase());
        }
      );
    } else {
      const minAmount = this.state[`${type}MinAmount`];
      const amountError = validateAmountToken(amount, minAmount);

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
        id: EXCHANGE_MODALS.EXCHANGE_CARD,
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

      setCurrentScreen({
        id: EXCHANGE_MODALS.EXCHANGE_ADDRESS,
        props: result,
      });
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
    const { getMinMaxAmount } = this.props;
    const { sellToken, buyToken } = this.state;

    if (sellToken.symbol === 'USD') {
      this.getRatesCarbon({
        sellAmount: 5.0,
      });
    } else {
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
    const { t } = this.props;
    const { value } = e.target;

    let emailError = null;

    if (!validateEmail(value)) {
      emailError = t('modals.transfers.exchange_commun.select.errors.email_format');
    }

    this.setState({ email: value, emailError });
  };

  renderFeePrice() {
    const { t } = this.props;
    const { sellAmount, sellToken, fee } = this.state;

    if (sellToken.symbol !== 'USD' || !fee || !sellAmount) {
      return null;
    }

    const feeValue = parseFloat(fee);

    return (
      <InfoFieldStyled
        titleLeft={t('modals.transfers.exchange_commun.select.fee')}
        titleRight={`$ ${feeValue.toFixed(2)}`}
        textLeft={t('modals.transfers.exchange_commun.select.pay')}
        textRight={`$ ${(parseFloat(sellAmount) + feeValue).toFixed(2)}`}
      />
    );
  }

  renderBody() {
    const { t } = this.props;
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
          <TitleGroup>{t('modals.transfers.exchange_commun.select.you_send')}</TitleGroup>
          <SellTokenItemStyled token={sellToken} onSelectClick={this.tokenSelect} />
          <InputStyled
            title={t('modals.transfers.exchange_commun.select.amount')}
            prefix={sellToken.symbol === 'USD' ? '$' : null}
            value={sellAmount}
            isError={Boolean(sellAmountError)}
            disabled={!sellToken || !buyToken}
            onChange={this.inputChangeHandler('sell')}
          />
        </InputGroupStyled>

        <Hint isShow={Boolean(sellMinAmount)}>
          {t('modals.transfers.exchange_commun.select.minimum_charge', {
            amount: sellMinAmount,
            symbol: sellToken.symbol,
          })}
        </Hint>

        <InputGroupStyled>
          <TitleGroup>{t('modals.transfers.exchange_commun.select.you_get')}</TitleGroup>
          <SellTokenItemStyled token={buyToken} />
          <InfoField textLeft={`${buyAmount} ${buyToken.symbol}`} />
          {sellToken.symbol === 'USD' ? (
            <InputStyled
              type="email"
              title={t('modals.transfers.exchange_commun.select.email')}
              autocomplete="email"
              isError={Boolean(emailError)}
              value={email}
              onChange={this.inputChangeEmail}
            />
          ) : null}
        </InputGroupStyled>

        {this.renderFeePrice()}

        <RateInfo isShow={buyToken && rate > 0}>
          {t('modals.transfers.exchange_commun.select.buy')}: 1 {sellToken.symbol} = {rate}{' '}
          {buyToken.symbol}
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
    const { close, t } = this.props;
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

          {isLoading ? <SplashLoader /> : null}

          <ButtonStyled
            primary
            fluid
            disabled={isSubmitButtonDisabled}
            onClick={this.onExchangeClick}
          >
            {t('modals.transfers.exchange_commun.select.buy')}
          </ButtonStyled>
        </Content>
      </Wrapper>
    );
  }
}
