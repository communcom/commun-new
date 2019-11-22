import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button } from '@commun/ui';
import { displayError } from 'utils/toastsMessages';
import { SHOW_MODAL_CONVERT_POINTS } from 'store/constants';
import { POINT_CONVERT_TYPE } from 'shared/constants';

import { WidgetCard } from 'components/widgets/common';

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  color: #fff;
`;

const RecieveBlock = styled.div`
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

export default function GetPointsWidget({ symbol, getBuyPrice, openModal }) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    async function getPrice() {
      try {
        const result = await getBuyPrice(symbol, '1 COMMUN');

        setPrice(result.price.split(' ')[0]);
      } catch (err) {
        displayError(err);
      }
    }

    getPrice();
  }, [symbol, getBuyPrice]);

  function onClick() {
    openModal(SHOW_MODAL_CONVERT_POINTS, {
      pointName: symbol,
      convertType: POINT_CONVERT_TYPE.BUY,
    });
  }

  const isLoading = !price;

  return (
    <WidgetCardStyled noPadding>
      <Wrapper>
        <IconGetPointsWrapper>
          <IconGetPoints />
        </IconGetPointsWrapper>
        <Prices>
          <RecieveBlock loading={isLoading}>
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
          </RecieveBlock>
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
  openModal: PropTypes.func.isRequired,
};
