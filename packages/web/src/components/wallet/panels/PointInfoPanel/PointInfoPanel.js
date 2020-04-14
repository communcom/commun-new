import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { up } from '@commun/ui';

import { POINT_CONVERT_TYPE, COMMUN_SYMBOL, TRANSACTION_HISTORY_TYPE } from 'shared/constants';
import { pointType } from 'types/common';
import { formatNumber } from 'utils/format';

import { CloseButtonStyled } from 'components/modals/transfers/common.styled';
import TransferHistory from 'components/wallet/history/TransferHistory';
import CurrencyCarousel from 'components/wallet/CurrencyCarousel';

import ActionsPanel from '../ActionsPanel';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
`;

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 30px 15px;
  width: 100%;

  position: relative;

  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 0 0 25px 25px;
  box-shadow: 0px 10px 44px rgba(29, 59, 220, 0.5);
  z-index: 999;

  ${up.mobileLandscape} {
    width: 330px;

    border-radius: 15px;
    box-shadow: unset;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 20px;

  width: 100%;
`;

const Point = styled.div``;

const PointCarousel = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;

const TotalPoints = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TotalBalanceTitle = styled.p`
  margin-bottom: 5px;

  font-size: 15px;
  font-weight: 600;
  color: #fff;
`;

const TotalBalanceCount = styled.p`
  font-size: 30px;
  font-weight: 600;
  color: #fff;
`;

const PriceTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #fff;
`;

const HoldPointsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 30px;

  width: 100%;
`;

const ProgressBarBackground = styled.div`
  margin-bottom: 10px;
  padding: 1px 0;

  width: 100%;
  height: 8px;

  background: ${({ theme }) => theme.colors.mediumBlue};
  border-radius: 10px;
`;

const ProgressBar = styled.div`
  width: ${({ now }) => now}%;
  height: 6px;

  background: linear-gradient(270deg, #4edbb0 0%, #b1f4e0 100%),
    linear-gradient(270deg, #6a80f5 0%, #c1caf8 100%);
  border-radius: 10px;
`;

const PrimaryText = styled.span`
  font-weight: 600;
  font-size: 12px;

  color: #fff;
`;

const SecondaryText = styled.span`
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  opacity: 0.7;
`;

const Text = styled.div``;

const HoldInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ActionsPanelStyled = styled(ActionsPanel)`
  margin-top: 30px;
`;

const HistoryWrapper = styled.div`
  position: relative;

  padding: 0 10px;
  width: 100%;

  ${is('isAside')`
    padding: 0;
    border-radius: 0 0 6px 6px;

    & > section {
      padding: 20px 0 10px;
    }

    &:not(:empty) {
      &::before {
        position: absolute;
        top: -12px;
        width: 100%;
        height: 15px;
        content: '';
        background-color: ${({ theme }) => theme.colors.white};
        z-index: 1;
      }
    }
  `};
`;

export default class PointInfoPanel extends PureComponent {
  static propTypes = {
    communPoint: PropTypes.object,
    currentPoint: pointType.isRequired,
    points: PropTypes.instanceOf(Map),
    mobilePanel: PropTypes.node,
    isMobile: PropTypes.bool.isRequired,
    isAside: PropTypes.bool,

    openModalConvertPoint: PropTypes.func.isRequired,
    openModalExchangeCommun: PropTypes.func.isRequired,
    openModalSendPoint: PropTypes.func.isRequired,
    showPointInfo: PropTypes.func.isRequired,
    closeAction: PropTypes.func,
  };

  static defaultProps = {
    points: new Map(),
    communPoint: {},
    mobilePanel: null,
    isAside: false,
    closeAction: undefined,
  };

  pointCarouselRenderer = () => {
    const { points, currentPoint, communPoint } = this.props;
    const pointsList = [communPoint, ...Array.from(points.values())];
    const pointIndex = pointsList.findIndex(point => point.symbol === currentPoint.symbol);

    return (
      <CurrencyCarousel
        cmnWithLightBackground
        currencies={pointsList}
        activeIndex={pointIndex}
        onSelect={this.onSelectPoint}
      />
    );
  };

  onSelectPoint = selectedPoint => {
    const { showPointInfo } = this.props;
    showPointInfo(selectedPoint.symbol);
  };

  sendPointsHandler = () => {
    const { currentPoint, openModalSendPoint } = this.props;

    openModalSendPoint({ symbol: currentPoint.symbol });
  };

  exchangeCommunHandler = () => {
    const { openModalExchangeCommun } = this.props;

    openModalExchangeCommun();
  };

  convertPointsHandler = () => {
    const { currentPoint, openModalConvertPoint } = this.props;

    if (currentPoint.symbol === COMMUN_SYMBOL) {
      openModalConvertPoint({ convertType: POINT_CONVERT_TYPE.BUY });
    } else {
      openModalConvertPoint({ convertType: POINT_CONVERT_TYPE.SELL, symbol: currentPoint.symbol });
    }
  };

  render() {
    const { currentPoint, mobilePanel, closeAction, isMobile, isAside } = this.props;

    const availableAmount =
      currentPoint.frozen && parseFloat(currentPoint.balance - currentPoint.frozen).toFixed(3);

    return (
      <Wrapper>
        <PanelWrapper>
          {closeAction && <CloseButtonStyled isBack={isMobile} onClick={closeAction} />}
          <Header>
            <PointCarousel>{this.pointCarouselRenderer()}</PointCarousel>
          </Header>
          <Point>
            <TotalPoints>
              <TotalBalanceTitle>{currentPoint.name}</TotalBalanceTitle>
              <TotalBalanceCount>{formatNumber(currentPoint.balance)}</TotalBalanceCount>
              {currentPoint.price > 0 && (
                <PriceTitle>= {formatNumber(currentPoint.price)} Commun</PriceTitle>
              )}
            </TotalPoints>
          </Point>
          {currentPoint.frozen && (
            <HoldPointsWrapper>
              <ProgressBarBackground>
                <ProgressBar now={(availableAmount * 100) / currentPoint.balance} />
              </ProgressBarBackground>
              <HoldInfo>
                <Text>
                  <PrimaryText>Available </PrimaryText>
                  <SecondaryText>/ Hold</SecondaryText>
                </Text>
                <Text>
                  <PrimaryText>{formatNumber(availableAmount)} </PrimaryText>
                  <SecondaryText>/ {formatNumber(currentPoint.frozen)}</SecondaryText>
                </Text>
              </HoldInfo>
            </HoldPointsWrapper>
          )}
          <ActionsPanelStyled
            sendPointsHandler={this.sendPointsHandler}
            exchangeCommunHandler={this.exchangeCommunHandler}
            convertPointsHandler={this.convertPointsHandler}
            symbol={currentPoint.symbol}
          />
        </PanelWrapper>
        {mobilePanel}
        <HistoryWrapper isAside={isAside}>
          <TransferHistory historyType={TRANSACTION_HISTORY_TYPE.POINT} />
        </HistoryWrapper>
      </Wrapper>
    );
  }
}
