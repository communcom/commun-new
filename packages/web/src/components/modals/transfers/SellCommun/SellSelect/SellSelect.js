/* eslint-disable react/destructuring-assignment,no-console */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import styled from 'styled-components';
import is from 'styled-is';

import { SplashLoader } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { displayError } from 'utils/toastsMessages';
import { sanitizeAmount, validateAmountToken } from 'utils/validatingInputs';

import {
  ButtonStyled,
  Error,
  ErrorWrapper,
  InputGroup,
  InputStyled,
} from 'components/modals/transfers/common.styled';
import BillingInfoBlock from 'components/modals/transfers/common/BillingInfoBlock';
import InfoField from 'components/modals/transfers/common/BillingInfoBlock/InfoField';
import Header from 'components/modals/transfers/common/Header/Header.connect';
import { Content, Wrapper } from 'components/modals/transfers/ExchangeCommun/common.styled';
import SellTokenItem from 'components/modals/transfers/ExchangeCommun/ExchangeSelect/common/SellTokenItem';
import { SELL_MODALS } from 'components/modals/transfers/SellCommun/constants';

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

@withTranslation()
export default class SellSelect extends PureComponent {
  static propTypes = {
    sellToken: PropTypes.object,
    buyToken: PropTypes.object,
    // showTokenSelect: PropTypes.bool,

    // openModalSelectToken: PropTypes.func.isRequired,
    payMirCalculate: PropTypes.func.isRequired,

    setCurrentScreen: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sellToken: null,
    buyToken: null,
    // showTokenSelect: false,
  };

  state = {
    rate: null,
    fee: null,

    sellMinAmount: 1000,
    // sellMaxAmount: null,

    sellAmount: undefined,
    buyAmount: 0,

    sellToken: this.props.sellToken,
    buyToken: this.props.buyToken,

    sellAmountError: null,
    buyAmountError: null,

    isLoading: false,
  };

  calculatePrice = throttle(
    async () => {
      const { payMirCalculate } = this.props;
      const { sellAmount, sellMinAmount, sellToken } = this.state;

      if (!sellAmount) {
        return;
      }

      try {
        // check only exists after edit
        const maxAmount = sellToken.balance;

        this.setState({
          sellAmountError: validateAmountToken(sellAmount, sellMinAmount, maxAmount),
        });

        const { fees, rate, outAmount, result, description } = await payMirCalculate({
          amount: sellAmount,
        });

        // check all variants
        // buyAmountError = validateAmountToken(buyAmountPrice, buyMinAmount, buyMaxAmount);

        if (!result && description) {
          throw new Error(description);
        }

        this.setState({
          rate,
          fee: fees,
          buyAmount: outAmount,
        });
      } catch (err) {
        displayError("Can't get exchange amount");
      }
    },
    500,
    { leading: false }
  );

  // componentDidMount() {
  //   const { showTokenSelect } = this.props;
  //
  //   if (showTokenSelect) {
  //     this.tokenSelect();
  //   }
  // }

  inputChangeHandler = async e => {
    let amount = sanitizeAmount(e.target.value);

    if (amount === '.') {
      amount = '0.';
    }

    const { sellMinAmount, sellToken } = this.state;
    const maxAmount = sellToken.balance;
    const amountError = validateAmountToken(amount, sellMinAmount, maxAmount);

    this.setState(
      {
        sellAmount: amount,
        sellAmountError: amountError,
      },
      () => {
        this.calculatePrice();
      }
    );
  };

  // tokenSelect = async () => {
  //   const { openModalSelectToken } = this.props;
  //
  //   const token = await openModalSelectToken();
  //
  //   if (token) {
  //     this.onSelectToken(token);
  //   }
  // };

  onNextClick = async () => {
    const { setCurrentScreen } = this.props;
    const { sellAmount, buyToken, fee } = this.state;

    try {
      setCurrentScreen({
        id: SELL_MODALS.SELL_ADDRESS,
        props: {
          amount: parseFloat(sellAmount) + parseFloat(fee),
          symbol: buyToken.symbol,
        },
      });
    } catch (err) {
      displayError("Can't create transaction");
    }
  };

  // onSelectToken = buyToken => {
  //   this.setState({
  //     buyToken,
  //   });
  // };

  renderFeePrice() {
    const { t } = this.props;
    const { sellAmount, fee, buyToken } = this.state;

    if (!fee || !sellAmount) {
      return null;
    }

    const feeValue = parseFloat(fee);

    return (
      <InfoFieldStyled
        titleLeft={t('modals.transfers.sell_commun.select.fee')}
        titleRight={`${feeValue} ${buyToken.symbol}`}
        textLeft={t('modals.transfers.sell_commun.select.pay')}
        textRight={`${parseFloat(sellAmount) + feeValue} CMN`}
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
    } = this.state;

    const error = sellAmountError || buyAmountError;

    return (
      <>
        <InputGroupStyled>
          <TitleGroup>{t('modals.transfers.sell_commun.select.you_send')}</TitleGroup>
          <SellTokenItemStyled token={sellToken} />
          <InputStyled
            title={t('modals.transfers.sell_commun.select.amount')}
            value={sellAmount}
            isError={Boolean(sellAmountError)}
            disabled={!sellToken || !buyToken}
            onChange={this.inputChangeHandler}
          />
        </InputGroupStyled>

        <Hint isShow={Boolean(sellMinAmount)}>
          {t('modals.transfers.sell_commun.select.minimum_charge', {
            amount: sellMinAmount,
            symbol: sellToken.symbol,
          })}
        </Hint>

        <InputGroupStyled>
          <TitleGroup>{t('modals.transfers.sell_commun.select.you_get')}</TitleGroup>
          <SellTokenItemStyled
            token={buyToken}
            // onSelectClick={this.tokenSelect}
          />
          <InfoField textLeft={`${buyAmount} ${buyToken.symbol}`} />
        </InputGroupStyled>

        {this.renderFeePrice()}

        <RateInfo isShow={buyToken && rate > 0}>
          {t('modals.transfers.sell_commun.select.sell')}: 1 {sellToken.symbol} = {rate}{' '}
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
      sellAmount,
      buyAmount,
      sellAmountError,
      buyAmountError,
      isLoading,
    } = this.state;

    const isSubmitButtonDisabled =
      !buyToken || !sellAmount || !buyAmount || sellAmountError || buyAmountError;

    return (
      <Wrapper>
        <Header
          isBlack
          titleLocaleKey="modals.transfers.sell_commun.common.header.title"
          close={close}
        />
        <Content>
          {this.renderBody()}

          <BillingInfoBlock showAgreement provider="PayMIR" />

          {isLoading ? <SplashLoader /> : null}

          <ButtonStyled primary fluid disabled={isSubmitButtonDisabled} onClick={this.onNextClick}>
            {t('common.next')}
          </ButtonStyled>
        </Content>
      </Wrapper>
    );
  }
}
