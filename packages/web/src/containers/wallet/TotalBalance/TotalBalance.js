import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { styles } from '@commun/ui';
import { Icon } from '@commun/icons';

import { SHOW_MODAL_CONVERT_POINTS, SHOW_MODAL_SEND_POINTS } from 'store/constants/modalTypes';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px 16px 24px;

  background-color: #fff;

  ${up('tablet')} {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    max-height: 122px;
    margin: 0 auto;
    padding: 24px;
    border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
    border-bottom: none;
    border-radius: 4px 4px 0 0;
  }
`;

const TotalPointsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0 16px;

  ${up('tablet')} {
    align-items: flex-start;
    padding: 0 24px;
  }
`;

const TotalBalanceTitle = styled.p`
  font-size: 13px;
  font-weight: bold;
  letter-spacing: -0.31px;
  line-height: normal;
  color: ${({ theme }) => theme.colors.contextGrey};

  ${styles.breakWord};
`;

const TotalBalanceCount = styled.p`
  font-size: 40px;
  font-weight: bold;
  letter-spacing: -0.31px;
`;

const ChartBlock = styled.div`
  display: none;

  ${up('tablet')} {
    display: flex;
    align-items: center;
    padding-right: 80px;
  }
`;

const ChartDelta = styled.span`
  margin-right: 16px;
  font-weight: 600;
  line-height: normal;
  font-size: 17px;
  letter-spacing: -0.41px;
  color: #4caf50;
`;

const Chart = styled.img`
  width: 60px;
  height: 20px;
  transform: rotate(-4.09deg);
`;

const ActionsWrapper = styled.div`
  display: flex;

  ${up('tablet')} {
    align-items: center;
    margin-left: auto;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.contextWhite};
`;

const IconWrapperStyled = styled(IconWrapper)`
  background-color: ${({ theme }) => theme.colors.contextBlue};
  color: #fff;
  transition: background-color 0.15s;
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: max-content;
  padding: 0 15px;
  font-size: 13px;
  letter-spacing: -0.31px;
  line-height: normal;
  color: ${({ theme }) => theme.colors.contextBlue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }

  &:hover ${/* sc-selector */ IconWrapperStyled}, &:focus ${/* sc-selector */ IconWrapperStyled} {
    background-color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

const CommunIcon = styled(Icon)`
  width: 7px;
  height: 16px;
`;

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
`;

export default class TotalBalance extends PureComponent {
  static propTypes = {
    openModal: PropTypes.func.isRequired,
  };

  sendPointsHandler = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_SEND_POINTS);
  };

  buyBTCHandler = () => {
    // TODO: here will be buyBTCHandler
  };

  convertPointsHandler = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_CONVERT_POINTS);
  };

  render() {
    return (
      <Wrapper>
        <IconWrapperStyled>
          <CommunIcon name="slash" />
        </IconWrapperStyled>
        <TotalPointsWrapper>
          <TotalBalanceTitle>Total balance</TotalBalanceTitle>
          <TotalBalanceCount>0</TotalBalanceCount>
        </TotalPointsWrapper>
        <ActionsWrapper>
          <ChartBlock>
            <ChartDelta>+2,4</ChartDelta>
            <Chart src="https://i.imgur.com/UGid8if.png" alt="chart" />
          </ChartBlock>
          <Action name="total-balance__send-points" onClick={this.sendPointsHandler}>
            <IconWrapper>
              <IconStyled name="send-points" />
            </IconWrapper>
            Send
          </Action>
          <Action name="total-balance__buy-points" onClick={this.buyBTCHandler}>
            <IconWrapperStyled>
              <IconStyled name="wallet" />
            </IconWrapperStyled>
            Buy with BTC
          </Action>
          <Action name="total-balance__convert-points" onClick={this.convertPointsHandler}>
            <IconWrapper>
              <IconStyled name="transfer-points" />
            </IconWrapper>
            Convert
          </Action>
        </ActionsWrapper>
      </Wrapper>
    );
  }
}
