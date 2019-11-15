import React from 'react';
import styled from 'styled-components';

import { formatNumber } from 'utils/format';
import { WidgetCard } from 'components/widgets/common';
import { Icon } from '@commun/icons';
import { Button } from '@commun/ui';

const WidgetCardStyled = styled(WidgetCard)`
  padding: 0;
  background: ${({ theme }) => theme.colors.blue};
  box-shadow: 0px 14px 24px rgba(106, 128, 245, 0.3);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px;
  height: 70px;
`;

const IconGetPointsWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #788cf7;
`;

const IconGetPoints = styled(Icon).attrs({ name: 'wallet' })`
  display: block;
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.white};
`;

const Prices = styled.div`
  margin-left: 10px;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
`;

const RecieveBlock = styled.div`
  display: flex;
  line-height: 1;
`;

const NameCP = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 24px;
  color: #d2d9fc;
`;

const Price = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 14px;
  color: #d2d9fc;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const ButtonStyled = styled(Button)`
  background-color: #ffffff;
`;

const GetPointsWidget = () => (
  <WidgetCardStyled noPadding>
    <Wrapper>
      <IconGetPointsWrapper>
        <IconGetPoints />
      </IconGetPointsWrapper>
      <Prices>
        <RecieveBlock>
          {formatNumber(1000)}&nbsp;<NameCP>Binance</NameCP>
        </RecieveBlock>
        <Price>= 1 Commun</Price>
      </Prices>
      <ButtonWrapper>
        <ButtonStyled>Get Points</ButtonStyled>
      </ButtonWrapper>
    </Wrapper>
  </WidgetCardStyled>
);

GetPointsWidget.propTypes = {};

export default GetPointsWidget;
