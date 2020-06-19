import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Glyph, up } from '@commun/ui';

import { pointType } from 'types/common';
import { SEND_MODAL_TYPE } from 'shared/constants';
import { formatMoney } from 'utils/format';

import { ButtonStyled, CloseButtonStyled } from '../common.styled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  height: 100vh;
  width: 100%;

  background-color: ${({ theme, type }) =>
    type === SEND_MODAL_TYPE.DONATE_POINTS ? '#000' : theme.colors.blue};

  ${up.mobileLandscape} {
    height: 70vh;
    width: 350px;

    border-radius: 25px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  margin-bottom: 31px;
  padding: 20px 15px 0;

  width: 100%;
`;

const HeaderTitle = styled.div`
  flex-grow: 1;

  font-size: 15px;
  font-weight: 600;
  color: #fff;
  text-align: center;
`;

const Point = styled.div``;

const PointCarousel = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;

  margin-bottom: 20px;
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
  color: #fff;
`;

const TotalBalanceCount = styled.p`
  font-size: 30px;
  font-weight: 600;
  color: #fff;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;

  position: relative;
  padding: 20px 15px 15px;
  padding-top: ${({ isSwapEnabled }) => (isSwapEnabled ? 40 : 20)}px;

  min-height: 356px;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 25px 25px 0 0;
  z-index: 999;

  ${up.mobileLandscape} {
    border-radius: 25px 25px 25px 25px;
  }
`;

const SwapIconStyled = styled(Glyph).attrs({ icon: 'swap', size: 'medium' })``;

const SwapAction = styled.div`
  position: absolute;
  top: -25px;

  border: 2px solid white;
  border-radius: 50%;

  cursor: pointer;
`;

export default class BasicTransferModal extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    point: pointType.isRequired,
    pointCarouselRenderer: PropTypes.func.isRequired,
    onSwapClick: PropTypes.func,
    body: PropTypes.node.isRequired,
    submitButtonText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
    onSubmitButtonClick: PropTypes.func.isRequired,
    isSubmitButtonDisabled: PropTypes.bool,

    isMobile: PropTypes.bool.isRequired,

    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onSwapClick: undefined,
    isSubmitButtonDisabled: false,
  };

  closeModal = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const {
      type,
      title,
      point,
      pointCarouselRenderer,
      body,
      onSwapClick,
      submitButtonText,
      onSubmitButtonClick,
      isSubmitButtonDisabled,
      isMobile,
    } = this.props;

    const isSwapEnabled = onSwapClick;

    return (
      <Wrapper type={type}>
        <Header>
          <CloseButtonStyled isBack={isMobile} onClick={this.closeModal} />
          <HeaderTitle>{title}</HeaderTitle>
        </Header>
        <Point>
          <PointCarousel>{pointCarouselRenderer()}</PointCarousel>
          <TotalPoints isSwapEnabled={isSwapEnabled}>
            <TotalBalanceTitle>{point.name}</TotalBalanceTitle>
            <TotalBalanceCount>{formatMoney(point.balance)}</TotalBalanceCount>
          </TotalPoints>
        </Point>
        <Body isSwapEnabled={isSwapEnabled}>
          {isSwapEnabled && (
            <SwapAction onClick={onSwapClick}>
              <SwapIconStyled />
            </SwapAction>
          )}
          {body}
          <ButtonStyled
            primary
            fluid
            disabled={isSubmitButtonDisabled}
            onClick={onSubmitButtonClick}
          >
            {submitButtonText}
          </ButtonStyled>
        </Body>
      </Wrapper>
    );
  }
}
