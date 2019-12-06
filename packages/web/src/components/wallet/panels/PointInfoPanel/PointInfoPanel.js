import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { Avatar, up } from '@commun/ui';

import { POINT_CONVERT_TYPE, COMMUN_SYMBOL } from 'shared/constants';
import { pointType } from 'types/common';
import { formatNumber } from 'utils/format';

import { CloseButtonStyled, HeaderCommunLogo } from 'components/modals/transfers/common.styled';
import HistoryList from 'components/wallet/HistoryList';

import ActionsPanel from '../ActionsPanel';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 30px 15px;

  width: 375px;

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

  margin-bottom: ${({ isSwapEnabled }) => (isSwapEnabled ? 40 : 20)}px;
`;

const TotalBalanceTitle = styled.p`
  margin-bottom: 5px;

  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const TotalBalanceCount = styled.p`
  font-size: 30px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const PriceTitle = styled.p`
  margin-bottom: 32px;

  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const HoldPointsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  margin-bottom: 30px;

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
  /* TODO fix color */
  background: linear-gradient(270deg, #4edbb0 0%, #c1caf8 100%);
  border-radius: 10px;
`;

const PrimaryText = styled.span`
  font-weight: 600;
  font-size: 12px;

  color: ${({ theme }) => theme.colors.white};
`;

const SecondaryText = styled.span`
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray};
`;

const Text = styled.div``;

const HoldInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HistoryPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;

  padding: 30px 10px 0;
  width: 355px;

  background: ${({ theme }) => theme.colors.white};
  border-radius: 15px;

  ${up.mobileLandscape} {
    width: 330px;

    border-radius: 0 0 6px 6px;
  }

  ${up.desktop} {
    ${isNot('isModal')`
        padding: 22px 0 0;
    `};

    &::before {
      position: absolute;
      top: -12px;

      width: 100%;
      height: 12px;

      content: '';
      background-color: ${({ theme }) => theme.colors.white};
      z-index: 1;

      ${is('isModal')`
        background-color: transparent;
      `};
    }
  }
`;

const HistoryPanelHeader = styled.div`
  margin-bottom: 20px;
  padding: 0 15px;

  width: 100%;
`;

const HistoryPanelTitle = styled.div`
  flex-grow: 1;

  font-size: 17px;
  font-weight: 600;
`;

const Items = styled.ul`
  width: 100%;
`;

export default class PointInfoPanel extends PureComponent {
  static propTypes = {
    currentPoint: pointType.isRequired,
    mobilePanel: PropTypes.node,
    pointHistory: PropTypes.arrayOf(PropTypes.shape({})),
    isMobile: PropTypes.bool.isRequired,

    getPointHistory: PropTypes.func.isRequired,
    openModalConvertPoint: PropTypes.func.isRequired,
    openModalSendPoint: PropTypes.func.isRequired,
    closeAction: PropTypes.func,
  };

  static defaultProps = {
    mobilePanel: null,
    pointHistory: [],
    closeAction: undefined,
  };

  async componentDidMount() {
    await this.fetchHistorySafe();
  }

  async componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.currentPoint.symbol !== prevProps.currentPoint.symbol) {
      await this.fetchHistorySafe();
    }
  }

  pointCarouselRenderer = () => {
    const { currentPoint } = this.props;

    if (currentPoint.symbol === COMMUN_SYMBOL) {
      return <HeaderCommunLogo />;
    }

    return <Avatar avatarUrl={currentPoint.logo} size="large" />;
  };

  sendPointsHandler = () => {
    const { currentPoint, openModalSendPoint } = this.props;

    openModalSendPoint({ symbol: currentPoint.symbol });
  };

  convertPointsHandler = () => {
    const { currentPoint, openModalConvertPoint } = this.props;

    if (currentPoint.symbol === COMMUN_SYMBOL) {
      openModalConvertPoint({ convertType: POINT_CONVERT_TYPE.BUY });
    } else {
      openModalConvertPoint({ convertType: POINT_CONVERT_TYPE.SELL, symbol: currentPoint.symbol });
    }
  };

  async fetchHistorySafe() {
    const { currentPoint, getPointHistory } = this.props;

    try {
      await getPointHistory(currentPoint.symbol);
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  }

  render() {
    const { currentPoint, pointHistory, mobilePanel, closeAction, isMobile } = this.props;

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
          <ActionsPanel
            sendPointsHandler={this.sendPointsHandler}
            convertPointsHandler={this.convertPointsHandler}
          />
        </PanelWrapper>
        {mobilePanel}
        {pointHistory.length ? (
          <HistoryPanel isModal={closeAction}>
            <HistoryPanelHeader>
              <HistoryPanelTitle>History</HistoryPanelTitle>
              {/* TODO filter button */}
            </HistoryPanelHeader>
            <Items>
              <HistoryList
                items={pointHistory}
                itemClickHandler={() => {
                  /* TODO */
                }}
              />
            </Items>
          </HistoryPanel>
        ) : null}
      </Wrapper>
    );
  }
}
