import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { COMMUN_SYMBOL } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { displayError } from 'utils/toastsMessages';

import AsyncAction from 'components/common/AsyncAction';
import { ButtonStyled } from 'components/modals/transfers/common.styled';
import BillingInfoBlock from 'components/modals/transfers/common/BillingInfoBlock/BillingInfoBlock';
import Header from 'components/modals/transfers/common/Header/Header.connect';
import { Content, Wrapper } from 'components/modals/transfers/ExchangeCommun/common.styled';
import { SELL_MODALS } from 'components/modals/transfers/SellCommun/constants';

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;
  font-weight: 600;
  font-size: 30px;
  line-height: 36px;
  text-align: center;
`;

const Textarea = styled.textarea`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 100px 0 140px;
  padding: 5px 8px;
  font-weight: 600;
  font-size: 24px;
  line-height: 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
  background: transparent;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  appearance: none;
  resize: none;

  &::placeholder {
    font-size: 24px;
    line-height: 22px;
    text-align: left;
    color: ${({ theme }) => theme.colors.gray};
    transition: opacity 0.2s ease-in-out, color 0.2s ease-in-out;
  }

  &:focus::placeholder {
    color: transparent;
  }
`;

const SellAddress = ({
  amount,
  symbol,
  payMirSellCMN,
  transfer,
  waitForTransaction,
  setCurrentScreen,
  close,
}) => {
  const { t } = useTranslation();
  const [address, setAddress] = useState('');

  async function onSellClick() {
    try {
      const trx = await transfer(
        'paymircommun',
        amount,
        COMMUN_SYMBOL,
        `${symbol} address: ${address}`
      );

      const txId = trx?.processed?.id;

      await waitForTransaction(txId);

      const result = await payMirSellCMN({ txId });

      setCurrentScreen({
        id: SELL_MODALS.SELL_SUCCESS,
        props: { ...result },
      });
    } catch (err) {
      displayError("Can't create transaction");
    }
  }

  return (
    <Wrapper>
      <Header
        isBlack
        titleLocaleKey="modals.transfers.sell_commun.common.header.title"
        close={close}
      />
      <Content>
        <Title>{t('modals.transfers.sell_commun.address.enter_address')}</Title>

        <Textarea
          placeholder={t('modals.transfers.sell_commun.address.address')}
          value={address}
          onChange={e => setAddress(e.target.value)}
        />

        <BillingInfoBlock
          showAgreement
          provider="PayMIR"
          titleLocaleKey="modals.transfers.sell_commun.common.billing_info.title"
          agreeLocalKey="modals.transfers.sell_commun.common.billing_info.agree"
        />

        <AsyncAction onClickHandler={onSellClick}>
          <ButtonStyled primary fluid>
            {t('common.next')}
          </ButtonStyled>
        </AsyncAction>
      </Content>
    </Wrapper>
  );
};

SellAddress.propTypes = {
  amount: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  payMirSellCMN: PropTypes.func.isRequired,
  transfer: PropTypes.func.isRequired,
  waitForTransaction: PropTypes.func.isRequired,

  setCurrentScreen: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default SellAddress;
