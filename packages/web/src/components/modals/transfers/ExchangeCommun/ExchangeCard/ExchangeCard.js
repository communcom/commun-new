/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';

import { displayError } from 'utils/toastsMessages';

import { up, CircleLoader } from '@commun/ui';
import { Wrapper, Content } from 'components/modals/transfers/ExchangeCommun/common.styled';
import Header from 'components/modals/transfers/ExchangeCommun/common/Header/Header.connect';
import { AmountGroup, ButtonStyled, InputStyled } from 'components/modals/transfers/common.styled';
import BillingInfoBlock from 'components/modals/transfers/ExchangeCommun/common/BillingInfoBlock/BillingInfoBlock';

const TopLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 10px 10px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #000;
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

export default class ExchangeCard extends Component {
  static propTypes = {
    contactId: PropTypes.string.isRequired,
    publicKey: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,

    addCard: PropTypes.func.isRequired,
    chargeCard: PropTypes.func.isRequired,

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

  onChangeCurrencyClick = () => {
    const { setCurrentScreen } = this.props;
    setCurrentScreen({ id: 0, props: { showTokenSelect: true } });
  };

  onExchangeClick = async () => {
    const { contactId, publicKey, amount, addCard, chargeCard } = this.props;
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

      const chargeResult = await chargeCard({
        creditDebitId: cardInfo.details.creditDebitId, // required
        fiatChargeAmount, // required
        cryptocurrencySymbol: 'commun', // required
        receiveAddress: publicKey, // required
        contactId: cardInfo.details.contactId, // required
        confirmationUrl: 'http://localhost:7000/payment/complete', // required
        successRedirectUrl: 'http://localhost:7000/payment/success', // required
        verificationRedirectUrl: 'http://localhost:7000/payment/verify', // required
        errorRedirectUrl: 'http://localhost:7000/payment/error', // required
      });

      if (chargeResult.status === 202) {
        console.warn('Need 2fa');
      } else if (chargeResult.charge3denrolled === 'Y') {
        const result = await fetch(chargeResult.acsurl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            PaReq: chargeResult.pareq,
            MD: chargeResult.md,
            TermUrl: chargeResult.termurl,
          }),
        });

        const html = await result.text();

        const width = 390;
        const height = 400;
        const leftPosition = window.screen.width ? (window.screen.width - width) / 2 : 0;
        const topPosition = window.screen.height ? (window.screen.height - height) / 2 : 0;

        const confirmationWindow = window.open(
          '/html/confirmation.html',
          'confirmationWindow',
          `height=${height},width=${width},top=${topPosition},left=${leftPosition},scrollbars,resizable`
        );

        confirmationWindow.onload = () => {
          const doc = confirmationWindow.document.getElementById('confirmationIframe').contentWindow
            .document;
          doc.open();
          doc.write(html);
          doc.close();
        };
      }
    } catch (err) {
      console.error(err);

      const message = err.data?.message || 'Something went wrong';
      displayError(message);
    }

    this.setState({ isLoading: false });
  };

  inputChangeCardNumber = e => {
    const { value } = e.target;

    const newState = {
      cardNumberMask: '9999-9999-9999-9999',
      cardNumber: value,
    };

    if (/^3[47]/.test(value)) {
      newState.cardNumberMask = '9999-999999-99999';
    }

    this.setState(newState);
  };

  render() {
    const { close } = this.props;
    const { cardNumber, expiry, cvc, premise, postal, cardNumberMask, isLoading } = this.state;

    const isSubmitButtonDisabled = !cardNumber || !expiry || !cvc || !premise || !postal;

    return (
      <Wrapper>
        <Header isBlack close={close} />
        <Content>
          <TopLine>
            <Title>From card</Title>
            <ChangeCurrency onClick={this.onChangeCurrencyClick}>Change currency</ChangeCurrency>
          </TopLine>
          <Input
            type="card"
            mask={cardNumberMask}
            title="Card number"
            value={cardNumber}
            onChange={this.inputChangeCardNumber}
          />

          <AmountGroup>
            <Input
              title="Exp.date"
              mask="99/99"
              value={expiry}
              onChange={e => this.setState({ expiry: e.target.value })}
            />
            <Input
              title="CVC"
              mask="999"
              value={cvc}
              onChange={e => this.setState({ cvc: e.target.value })}
            />
          </AmountGroup>

          <Input
            title="Billing Address"
            value={premise}
            onChange={e => this.setState({ premise: e.target.value })}
          />
          <Input
            title="Billing Postal"
            value={postal}
            onChange={e => this.setState({ postal: e.target.value })}
          />

          <BillingInfoBlock provider="Carbon" />

          {isLoading ? <CircleLoader /> : null}

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
