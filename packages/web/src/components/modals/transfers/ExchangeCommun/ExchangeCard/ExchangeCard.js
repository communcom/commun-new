/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { STATUS_CARBON_SUCCESS } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { displayError } from 'utils/toastsMessages';

import { up, SplashLoader } from '@commun/ui';
import { EXCHANGE_MODALS } from 'components/modals/transfers/ExchangeCommun/constants';
import { Wrapper, Content } from 'components/modals/transfers/ExchangeCommun/common.styled';
import Header from 'components/modals/transfers/common/Header/Header.connect';
import { AmountGroup, ButtonStyled, InputStyled } from 'components/modals/transfers/common.styled';
import BillingInfoBlock from 'components/modals/transfers/common/BillingInfoBlock/BillingInfoBlock';

const TopLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 10px 10px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.black};
`;

const ChangeCurrency = styled.button`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.blue};

  ${up.tablet} {
    display: inline-block;
  }
`;

const Input = styled(InputStyled)`
  margin-bottom: 10px;
`;

function getGeneratedPageURL({ html, css, js }) {
  const getBlobURL = (code, type) => {
    const blob = new Blob([code], { type });
    return URL.createObjectURL(blob);
  };

  const source = `
    <html>
      <head>
        ${
          css
            ? `<link rel="stylesheet" type="text/css" href="${getBlobURL(css, 'text/css')}" />`
            : ''
        }
        ${js ? `<script src="${getBlobURL(js, 'text/javascript')}"></script>` : ''}
      </head>
      <body onLoad="document.form.submit();">
        ${html || ''}
      </body>
    </html>
  `;

  return getBlobURL(source, 'text/html');
}

@withTranslation()
export default class ExchangeCard extends Component {
  static propTypes = {
    contactId: PropTypes.string.isRequired,
    publicKey: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,

    addCard: PropTypes.func.isRequired,
    chargeCard: PropTypes.func.isRequired,
    openModalExchange3DS: PropTypes.func.isRequired,

    setCurrentScreen: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  state = {
    cardNumber: '', // for tests 5100000000000511
    expiry: '', // for tests 12/2030
    cvc: '', // for tests 123
    premise: '', // for tests No 789
    postal: '', // for tests TE45 6ST
    isLoading: false,
  };

  openError = ({ orderId, errors }) => {
    const { setCurrentScreen } = this.props;
    setCurrentScreen({ id: EXCHANGE_MODALS.EXCHANGE_ERROR, props: { orderId, errors } });
  };

  openPaymentVerify = ({ orderId, callbackUrl, sandboxCode }) => {
    const { setCurrentScreen } = this.props;
    setCurrentScreen({
      id: EXCHANGE_MODALS.EXCHANGE_2FA,
      props: { orderId, callbackUrl, sandboxCode },
    });
  };

  onChangeCurrencyClick = () => {
    const { setCurrentScreen } = this.props;

    setCurrentScreen({
      id: EXCHANGE_MODALS.EXCHANGE_SELECT,
      props: { showTokenSelect: true },
    });
  };

  onExchangeClick = async () => {
    const {
      contactId,
      publicKey,
      amount,
      addCard,
      chargeCard,
      openModalExchange3DS,
      setCurrentScreen,
      t,
    } = this.props;
    const { cardNumber, expiry, cvc, premise, postal } = this.state;

    this.setState({ isLoading: true });

    try {
      const cardInfo = await addCard({
        cardNumber, // required
        expiry, // required
        cvc, // required
        billingPremise: premise, // required
        billingPostal: postal, // required

        contactId, // required
        rememberMe: false, // required
        fiatBaseCurrency: 'USD', // required
      });

      const fiatChargeAmount = Number(amount).toFixed(2) * 100; // amount in cents
      const { origin } = window.location;

      const chargeResult = await chargeCard({
        creditDebitId: cardInfo.details.creditDebitId, // required
        fiatChargeAmount, // required
        cryptocurrencySymbol: 'commun', // required
        receiveAddress: publicKey, // required
        contactId: cardInfo.details.contactId, // required
        confirmationUrl: `${origin}`, // required // TODO: maybe our backend?
        verificationRedirectUrl: `${origin}/payment/verification.html`, // required
        successRedirectUrl: `${origin}/api/payment/success`, // required
        errorRedirectUrl: `${origin}/payment/error.html`, // required
        // bypassCardVerification: true, // useful for debug
      });

      if (chargeResult.charge3denrolled === 'U' || chargeResult.charge3denrolled === 'N') {
        displayError(chargeResult.message);
      } else if (chargeResult.charge3denrolled === 'Y') {
        const url = getGeneratedPageURL({
          html: `
            <div>
              <h2 style="text-align:center;">${t(
                'modals.transfers.exchange_commun.card.loading_acs'
              )}</h2>
              <form style="visibility:hidden;" name="form" id="form" action="${
                chargeResult.acsurl
              }" method="POST">
                <input type="hidden" name="PaReq" value="${chargeResult.pareq}" />
                <input type="hidden" name="TermUrl" value="${chargeResult.termurl}" />
                <input type="hidden" name="MD" value="${chargeResult.md}" />
              </form>
            </div>
          `,
        });

        const result = await openModalExchange3DS({ url });

        if (result.errors) {
          this.openError(result);
        } else if (result.status === STATUS_CARBON_SUCCESS) {
          setCurrentScreen({
            id: EXCHANGE_MODALS.EXCHANGE_SUCCESS,
            props: { orderId: result.data.orderId },
          });
        } else {
          this.openPaymentVerify(result.data);
        }
      }
    } catch (err) {
      const message = err.data?.message || 'Something went wrong';
      displayError(message);
    }

    this.setState({ isLoading: false });
  };

  inputChangeCardNumber = e => {
    const { value } = e.target;

    const newState = {
      cardNumberMask: '9999 9999 9999 9999',
      cardNumber: value.replace(/\s/g, ''),
    };

    if (/^3[47]/.test(value)) {
      newState.cardNumberMask = '9999 999999 99999';
    }

    this.setState(newState);
  };

  render() {
    const { close, t } = this.props;
    const { cardNumber, expiry, cvc, premise, postal, cardNumberMask, isLoading } = this.state;

    const isSubmitButtonDisabled = !cardNumber || !expiry || !cvc || !premise || !postal;

    return (
      <Wrapper>
        <Header
          isBlack
          titleLocaleKey="modals.transfers.exchange_commun.common.header.title"
          close={close}
        />
        <Content>
          <TopLine>
            <Title>{t('modals.transfers.exchange_commun.card.title')}</Title>
            <ChangeCurrency onClick={this.onChangeCurrencyClick}>
              {t('modals.transfers.exchange_commun.card.change_currency')}
            </ChangeCurrency>
          </TopLine>
          <Input
            type="card"
            autocomplete="cc-number"
            mask={cardNumberMask}
            title={t('modals.transfers.exchange_commun.card.card_number')}
            value={cardNumber}
            onChange={this.inputChangeCardNumber}
            autoFocus
            required
          />

          <AmountGroup>
            <Input
              title={t('modals.transfers.exchange_commun.card.exp_date')}
              autocomplete="cc-exp"
              mask="99/9999"
              maskChar="_"
              value={expiry}
              onChange={e => this.setState({ expiry: e.target.value })}
              required
            />
            <Input
              type="password"
              autocomplete="cc-csc"
              title={t('modals.transfers.exchange_commun.card.cvc')}
              mask="999"
              value={cvc}
              onChange={e => this.setState({ cvc: e.target.value })}
              required
            />
          </AmountGroup>

          <Input
            title={t('modals.transfers.exchange_commun.card.address')}
            autocomplete="address-line1"
            value={premise}
            onChange={e => this.setState({ premise: e.target.value })}
            required
          />
          <Input
            title={t('modals.transfers.exchange_commun.card.postal_code')}
            autocomplete="postal-code"
            value={postal}
            onChange={e => this.setState({ postal: e.target.value })}
            required
          />

          <BillingInfoBlock provider="Carbon" />

          {isLoading ? <SplashLoader /> : null}

          <ButtonStyled
            primary
            fluid
            disabled={isSubmitButtonDisabled}
            onClick={this.onExchangeClick}
          >
            {t('common.continue')}
          </ButtonStyled>
        </Content>
      </Wrapper>
    );
  }
}
