import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Button, Skeleton, up, styles } from '@commun/ui';

import {
  POINT_CONVERT_TYPE,
  MAX_COMMUNITY_CARD_NAME_LENGTH,
  MAX_COMMUNITY_SYMBOL_NAME_LENGTH,
} from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { useGetPoints } from 'utils/hooks';
import { smartTrim } from 'utils/text';

import { WidgetCard } from 'components/widgets/common';
import BalanceValue from './BalanceValue';

const WidgetCardStyled = styled(WidgetCard)`
  padding: 0;
  border-radius: 10px;

  ${up.mobileLandscape} {
    border-radius: 6px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 12px 15px;
  height: 64px;
`;

const BalanceWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 102px;
  padding: 0 15px;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(290deg, ${({ theme }) => theme.colors.blue} -7.34%, #b6c1fd 120%);
`;

const IconGetPointsWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #aab6fb;
`;

const IconGetPoints = styled(Icon).attrs({ name: 'wallet' })`
  display: block;
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.colors.white};
`;

const BalanceText = styled.div`
  margin-left: 15px;
`;

const BalanceValueStyled = styled(BalanceValue)`
  font-size: 27px;
`;

const PriceBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 24px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
`;

const ReceiveBlock = styled.div`
  display: flex;
  align-items: center;
  height: 22px;
`;

const Price = styled.span`
  margin-right: 2px;
  font-weight: bold;
  color: #000;
`;

const BalanceTitle = styled.div`
  position: relative;
  z-index: 6;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: rgba(255, 255, 255, 0.7);

  ${styles.breakWord};

  &:hover,
  &:focus {
    ${props => (props['aria-label'] ? styles.withBottomTooltip : '')};
  }
`;

const BalanceValueWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
`;

const PriceLine = styled.div`
  font-size: 16px;
  line-height: 1;
`;

const NameCP = styled.span`
  position: relative;
  z-index: 5;
  font-weight: 600;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};

  &:hover,
  &:focus {
    ${props => (props['aria-label'] ? styles.withBottomTooltip : '')};
  }
`;

const PricePer = styled.div`
  margin-top: 2px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;

  & > button {
    min-width: 90px;
    padding: 0 14px;
  }
`;

export default function GetPointsWidget({
  className,
  symbol,
  balance,
  communityName,
  checkAuth,
  openModalConvertPoint,
}) {
  const { t } = useTranslation();
  const price = useGetPoints({ symbol });

  const name = useMemo(() => smartTrim(communityName, MAX_COMMUNITY_CARD_NAME_LENGTH), [
    communityName,
  ]);
  const symbolName = useMemo(() => smartTrim(communityName, MAX_COMMUNITY_SYMBOL_NAME_LENGTH), [
    communityName,
  ]);

  async function onClick() {
    try {
      await checkAuth({ allowLogin: true });
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
      <BalanceWrapper>
        <IconGetPointsWrapper>
          <IconGetPoints />
        </IconGetPointsWrapper>
        <BalanceText>
          <BalanceTitle
            aria-label={
              communityName.length > MAX_COMMUNITY_CARD_NAME_LENGTH
                ? `${communityName} balance`
                : null
            }
          >
            {name} balance
          </BalanceTitle>
          <BalanceValueWrapper>
            {isLoading ? (
              <Skeleton
                primaryColor="#d1d8fc"
                secondaryColor="#fff"
                secondaryOpacity={0.7}
                width="100"
                height="8"
              />
            ) : (
              <BalanceValueStyled value={balance} />
            )}
          </BalanceValueWrapper>
        </BalanceText>
      </BalanceWrapper>
      <Wrapper>
        <PriceBlock>
          <ReceiveBlock>
            {isLoading ? (
              <Skeleton primaryColor="#eee" secondaryColor="#ddd" width="80" height="4" />
            ) : (
              <PriceLine>
                <Price>{price}</Price>
                <NameCP
                  aria-label={
                    communityName.length > MAX_COMMUNITY_SYMBOL_NAME_LENGTH
                      ? `${communityName}`
                      : null
                  }
                >
                  {symbolName}
                </NameCP>
              </PriceLine>
            )}
          </ReceiveBlock>
          <PricePer>= 1 Commun</PricePer>
        </PriceBlock>
        <ButtonWrapper>
          <Button primary onClick={onClick}>
            {t('widgets.get_points.get')}
          </Button>
        </ButtonWrapper>
      </Wrapper>
    </WidgetCardStyled>
  );
}

GetPointsWidget.propTypes = {
  communityName: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,

  checkAuth: PropTypes.func.isRequired,
  openModalConvertPoint: PropTypes.func.isRequired,
};
