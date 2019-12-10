import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button, up } from '@commun/ui';
import { displayError } from 'utils/toastsMessages';
import { POINT_CONVERT_TYPE } from 'shared/constants';

import { WidgetCard } from 'components/widgets/common';

const WidgetCardStyled = styled(WidgetCard)`
  padding: 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.blue};
  box-shadow: 0 14px 24px rgba(106, 128, 245, 0.3);

  ${up.mobileLandscape} {
    border-radius: 6px;
  }
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  color: #fff;
`;

const ReceiveBlock = styled.div`
  display: flex;
  align-items: baseline;
  line-height: 1;
  height: 20px;

  svg {
    width: 60%;
    height: 4px;
  }

  ${is('loading')`
    align-items: center;
  `};
`;

const NameCP = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
  color: #d2d9fc;
`;

const Price = styled.div`
  font-weight: 600;
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
  background-color: #fff;
`;

export default function GetPointsWidget({
  className,
  symbol,
  getBuyPrice,
  checkAuth,
  openModalConvertPoint,
}) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    async function getPrice() {
      try {
        const result = await getBuyPrice(symbol, '1 CMN');

        setPrice(result.price.split(' ')[0]);
      } catch (err) {
        displayError(err);
      }
    }

    getPrice();
  }, [symbol, getBuyPrice]);

  async function onClick() {
    try {
      await checkAuth(true);
    } catch {
      return;
    }

    openModalConvertPoint({
      symbol,
      convertType: POINT_CONVERT_TYPE.BUY,
    });
  }

  const isLoading = !price;

  return (
    <WidgetCardStyled noPadding className={className}>
      <Wrapper>
        <IconGetPointsWrapper>
          <IconGetPoints />
        </IconGetPointsWrapper>
        <Prices>
          <ReceiveBlock loading={isLoading}>
            {isLoading ? (
              <ContentLoader
                primaryColor="#5f73dc"
                secondaryColor="#5566c4"
                width="100"
                height="4"
              />
            ) : (
              <>
                {price}&nbsp;<NameCP>{symbol}</NameCP>
              </>
            )}
          </ReceiveBlock>
          <Price>= 1 Commun</Price>
        </Prices>
        <ButtonWrapper>
          <ButtonStyled onClick={onClick}>Get Points</ButtonStyled>
        </ButtonWrapper>
      </Wrapper>
    </WidgetCardStyled>
  );
}

GetPointsWidget.propTypes = {
  symbol: PropTypes.string.isRequired,
  getBuyPrice: PropTypes.func.isRequired,

  checkAuth: PropTypes.func.isRequired,
  openModalConvertPoint: PropTypes.func.isRequired,
};
