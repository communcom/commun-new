import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { styles } from '@commun/ui';

import { POINT_CONVERT_TYPE } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import {
  SHOW_MODAL_CONVERT_POINTS,
  SHOW_MODAL_EXCHANGE_COMMUN,
  SHOW_MODAL_SELL_COMMUN,
  SHOW_MODAL_SEND_POINTS,
} from 'store/constants/modalTypes';

import Amount from 'components/common/Amount';
import { ActionsPanel, BalancePanel } from 'components/pages/wallet';
import CurrencyGlyph from 'components/pages/wallet/common/CurrencyGlyph';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 2px;
  padding: 21px 15px;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 6px 6px 0 0;
`;

const TotalPoints = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  margin-right: 10px;
`;

const TotalBalanceTitle = styled.div`
  display: flex;
  flex-flow: wrap;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const TotalBalanceCount = styled.p`
  font-size: 22px;
  font-weight: 600;
  ${styles.breakWord};
`;

const CurrencySwitchers = styled.div``;

const Currency = styled.span`
  text-decoration: underline;
  cursor: pointer;

  ${is('isActive')`
    color: ${({ theme }) => theme.colors.blue};
  `}

  ${is('isActive', 'isMobile')`
    color: ${({ theme }) => theme.colors.chooseColor};
  `}
`;

@withTranslation()
export default class TotalBalance extends PureComponent {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    totalBalance: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,

    updateSettings: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  sendPointsHandler = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_SEND_POINTS);
  };

  exchangeCommunHandler = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_EXCHANGE_COMMUN, {});
  };

  sellCommunHandler = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_SELL_COMMUN, {});
  };

  convertPointsHandler = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_CONVERT_POINTS, { convertType: POINT_CONVERT_TYPE.BUY });
  };

  handleCurrencyClick = symbol => async () => {
    const { updateSettings } = this.props;
    const options = {
      basic: {
        currency: symbol,
      },
    };

    try {
      await updateSettings(options);
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  };

  renderActionPanel = () => (
    <ActionsPanel
      isTotalBalance
      sendPointsHandler={this.sendPointsHandler}
      exchangeCommunHandler={this.exchangeCommunHandler}
      sellCommunHandler={this.sellCommunHandler}
      convertPointsHandler={this.convertPointsHandler}
      symbol="CMN"
    />
  );

  renderCurrencySwitchers = () => {
    const { currency } = this.props;

    return (
      <CurrencySwitchers>
        <Currency isActive={currency === 'USD'} onClick={this.handleCurrencyClick('USD')}>
          USD
        </Currency>
        {' / '}
        <Currency isActive={currency === 'CMN'} onClick={this.handleCurrencyClick('CMN')}>
          Commun
        </Currency>
      </CurrencySwitchers>
    );
  };

  render() {
    const { totalBalance, currency, isMobile, t } = this.props;

    if (isMobile) {
      return (
        <BalancePanel
          currency={currency}
          totalBalance={totalBalance}
          enableActions={isMobile}
          actionPanelRenderer={this.renderActionPanel}
          onCurrencyClick={this.handleCurrencyClick}
        />
      );
    }

    return (
      <Wrapper>
        <CurrencyGlyph currency={currency} size="large" />
        <TotalPoints>
          <TotalBalanceTitle>
            {t('common.equity_value')}&nbsp;{this.renderCurrencySwitchers()}
          </TotalBalanceTitle>
          <TotalBalanceCount>
            <Amount value={totalBalance} isMultiply />
          </TotalBalanceCount>
        </TotalPoints>
        {this.renderActionPanel()}
      </Wrapper>
    );
  }
}
