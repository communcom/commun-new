import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Avatar, up } from '@commun/ui';

import { POINT_CONVERT_TYPE, COMMUN_SYMBOL } from 'shared/constants';
import { pointType } from 'types/common';

import { CloseButtonStyled, HeaderCommunLogo } from 'components/modals/transfers/common.styled';

import ActionsPanel from '../ActionsPanel';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 30px 15px;

  width: 375px;

  position: relative;

  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 0 0 25px 25px;
  box-shadow: 0px 10px 44px rgba(29, 59, 220, 0.5);

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

export default class PointInfoPanel extends PureComponent {
  static propTypes = {
    currentPoint: pointType.isRequired,
    isMobile: PropTypes.bool.isRequired,

    openModalConvertPoint: PropTypes.func.isRequired,
    openModalSendPoint: PropTypes.func.isRequired,
    closeAction: PropTypes.func.isRequired,
  };

  static defaultProps = {};

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

  render() {
    const { currentPoint, closeAction, isMobile } = this.props;

    const availableAmount =
      currentPoint.frozen && parseFloat(currentPoint.balance - currentPoint.frozen).toFixed(3);

    return (
      <Wrapper>
        {closeAction && <CloseButtonStyled isBack={isMobile} onClick={closeAction} />}
        <Header>
          <PointCarousel>{this.pointCarouselRenderer()}</PointCarousel>
        </Header>
        <Point>
          <TotalPoints>
            <TotalBalanceTitle>{currentPoint.name}</TotalBalanceTitle>
            <TotalBalanceCount>{currentPoint.balance}</TotalBalanceCount>
            {currentPoint.price > 0 && <PriceTitle>= {currentPoint.price} Commun</PriceTitle>}
          </TotalPoints>
        </Point>
        {currentPoint.frozen && (
          <HoldPointsWrapper>
            <ProgressBarBackground>
              <ProgressBar now={(availableAmount * 100) / currentPoint.balance} />
            </ProgressBarBackground>
            <HoldInfo>
              <Text>
                <PrimaryText>Availible </PrimaryText>
                <SecondaryText>/ Hold</SecondaryText>
              </Text>
              <Text>
                <PrimaryText>{availableAmount} </PrimaryText>
                <SecondaryText>/ {currentPoint.frozen}</SecondaryText>
              </Text>
            </HoldInfo>
          </HoldPointsWrapper>
        )}
        <ActionsPanel
          sendPointsHandler={this.sendPointsHandler}
          convertPointsHandler={this.convertPointsHandler}
        />
      </Wrapper>
    );
  }
}
