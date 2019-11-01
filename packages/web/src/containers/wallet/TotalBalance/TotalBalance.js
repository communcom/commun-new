import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { styles, up } from '@commun/ui';
import { Icon } from '@commun/icons';

import { SHOW_MODAL_CONVERT_POINTS, SHOW_MODAL_SEND_POINTS } from 'store/constants/modalTypes';

import { POINT_CONVERT_TYPE } from 'shared/constants';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px 16px 24px;
  margin-bottom: 2px;

  background-color: #fff;

  ${up.tablet} {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    max-height: 122px;
    margin: 0 auto 2px;
    padding: 24px;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
  }
`;

const TotalPointsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0 16px;

  ${up.tablet} {
    align-items: flex-start;
    padding: 0 24px;
  }
`;

const TotalBalanceTitle = styled.p`
  font-size: 13px;
  font-weight: bold;
  line-height: normal;
  color: ${({ theme }) => theme.colors.gray};

  ${styles.breakWord};
`;

const TotalBalanceCount = styled.p`
  font-size: 40px;
  font-weight: bold;
`;
/*
const ChartBlock = styled.div`
  display: none;

  ${up.tablet} {
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
  color: #4caf50;
`;

const Chart = styled.img`
  width: 60px;
  height: 20px;
  transform: rotate(-4.09deg);
`;
*/
const ActionsWrapper = styled.div`
  display: flex;

  ${up.tablet} {
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
  background-color: ${({ theme }) => theme.colors.background};
`;

const IconWrapperStyled = styled(IconWrapper)`
  background-color: ${({ theme }) => theme.colors.blue};
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
  line-height: normal;
  color: ${({ theme }) => theme.colors.blue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }

  &:hover ${/* sc-selector */ IconWrapperStyled}, &:focus ${/* sc-selector */ IconWrapperStyled} {
    background-color: ${({ theme }) => theme.colors.blueHover};
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
    comunBalance: PropTypes.string.isRequired,

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
    openModal(SHOW_MODAL_CONVERT_POINTS, { convertType: POINT_CONVERT_TYPE.BUY });
  };

  render() {
    const { comunBalance } = this.props;

    return (
      <Wrapper>
        <IconWrapperStyled>
          <CommunIcon name="slash" />
        </IconWrapperStyled>
        <TotalPointsWrapper>
          <TotalBalanceTitle>Total balance</TotalBalanceTitle>
          <TotalBalanceCount>{comunBalance}</TotalBalanceCount>
        </TotalPointsWrapper>
        <ActionsWrapper>
          {/* <ChartBlock>
            <ChartDelta>+2,4</ChartDelta>
            <Chart src="https://i.imgur.com/UGid8if.png" alt="chart" />
          </ChartBlock> */}
          <Action name="total-balance__send-points" onClick={this.sendPointsHandler}>
            <IconWrapper>
              <IconStyled name="send-points" />
            </IconWrapper>
            Send
          </Action>
          {/* <Action name="total-balance__buy-points" onClick={this.buyBTCHandler}>
            <IconWrapperStyled>
              <IconStyled name="wallet" />
            </IconWrapperStyled>
            Buy with BTC
          </Action> */}
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
