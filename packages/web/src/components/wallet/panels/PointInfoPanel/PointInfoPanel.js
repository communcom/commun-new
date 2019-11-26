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

  background-color: ${({ theme }) => theme.colors.blue};

  ${up.mobileLandscape} {
    width: 330px;

    border-radius: 15px;
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

const ActionsPanelStyled = styled(ActionsPanel)`
  width: 300px;
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
    return (
      <Wrapper>
        <Header>
          {closeAction && <CloseButtonStyled isBack={isMobile} onClick={closeAction} />}
          <PointCarousel>{this.pointCarouselRenderer()}</PointCarousel>
        </Header>
        <Point>
          <TotalPoints>
            <TotalBalanceTitle>{currentPoint.name}</TotalBalanceTitle>
            <TotalBalanceCount>{currentPoint.balance}</TotalBalanceCount>
            {currentPoint.price && <PriceTitle>= {currentPoint.price} Commun</PriceTitle>}
          </TotalPoints>
        </Point>
        <ActionsPanelStyled
          sendPointsHandler={this.sendPointsHandler}
          convertPointsHandler={this.convertPointsHandler}
        />
      </Wrapper>
    );
  }
}
