import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Glyph } from '@commun/ui';

import { POINT_CONVERT_TYPE } from 'shared/constants';
import {
  SHOW_MODAL_CONVERT_POINTS,
  SHOW_MODAL_EXCHANGE_COMMUN,
  SHOW_MODAL_SEND_POINTS,
} from 'store/constants/modalTypes';
import { formatNumber } from 'utils/format';

import { ActionsPanel, BalancePanel } from 'components/wallet';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 2px;
  padding: 21px 15px;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 6px 6px 0 0;
`;

const GlyphStyled = styled(Glyph).attrs({ icon: 'commun', size: 'large' })`
  margin-right: 10px;

  & > svg {
    width: 8px;
    height: 19px;
  }
`;

const TotalPoints = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  margin-right: 10px;
`;

const TotalBalanceTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const TotalBalanceCount = styled.p`
  font-size: 30px;
  font-weight: 600;
`;

const ActionsPanelDesktop = styled(ActionsPanel)`
  padding: 0;

  width: 178px;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: unset;

  & button {
    color: ${({ theme }) => theme.colors.blue};
  }

  & div {
    color: ${({ theme }) => theme.colors.blue};
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

export default class TotalBalance extends PureComponent {
  static propTypes = {
    totalBalance: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,

    openModal: PropTypes.func.isRequired,
  };

  sendPointsHandler = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_SEND_POINTS);
  };

  exchangeCommunHandler = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_EXCHANGE_COMMUN, { exchangeType: 'BUY' });
  };

  convertPointsHandler = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_CONVERT_POINTS, { convertType: POINT_CONVERT_TYPE.BUY });
  };

  renderActionPanel = () => {
    const { isMobile } = this.props;

    const Component = isMobile ? ActionsPanel : ActionsPanelDesktop;

    return (
      <Component
        sendPointsHandler={this.sendPointsHandler}
        exchangeCommunHandler={this.exchangeCommunHandler}
        convertPointsHandler={this.convertPointsHandler}
      />
    );
  };

  render() {
    const { totalBalance, isMobile } = this.props;

    if (isMobile) {
      return (
        <BalancePanel
          totalBalance={totalBalance}
          enableActions={isMobile}
          actionPanelRenderer={this.renderActionPanel}
        />
      );
    }

    return (
      <Wrapper>
        <GlyphStyled />
        <TotalPoints>
          <TotalBalanceTitle>Equity Value Commun</TotalBalanceTitle>
          <TotalBalanceCount>{formatNumber(totalBalance)}</TotalBalanceCount>
        </TotalPoints>
        {this.renderActionPanel()}
      </Wrapper>
    );
  }
}
