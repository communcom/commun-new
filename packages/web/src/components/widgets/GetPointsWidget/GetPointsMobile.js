import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';
import is from 'styled-is';

import { Button, up, styles } from '@commun/ui';

import { POINT_CONVERT_TYPE, MAX_COMMUNITY_SYMBOL_NAME_LENGTH } from 'shared/constants';
import { useGetPoints } from 'utils/hooks';
import { smartTrim } from 'utils/text';
import { WidgetCard, IconGetPointsWrapper, IconGetPoints } from 'components/widgets/common';

const WidgetCardStyled = styled(WidgetCard)`
  padding: 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.blue};
  box-shadow: 0 14px 24px rgba(106, 128, 245, 0.3);

  ${up.mobileLandscape} {
    border-radius: 6px;
  }

  ${up.tablet} {
    width: 100%;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px;
  height: 70px;
`;

const Prices = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
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
  height: 24px;

  svg {
    width: 60%;
    height: 4px;
  }

  ${is('loading')`
    align-items: center;
  `};
`;

const NameCP = styled.span`
  position: relative;
  z-index: 5;
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
  color: #d2d9fc;

  &:hover,
  &:focus {
    ${props => (props['aria-label'] ? styles.withBottomTooltip : '')};
  }
`;

const Price = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #d2d9fc;
`;

const Points = styled.p`
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const FullButtonStyled = styled(Button)`
  display: none;
  background-color: #fff;

  @media (min-width: 375px) {
    display: inline;
  }
`;

const SmallButtonStyled = styled(Button)`
  display: inline;
  background-color: #fff;
  min-width: unset;

  @media (min-width: 375px) {
    display: none;
  }
`;

function smartRound(val) {
  if (!val) {
    return val;
  }

  const str = String(val);

  if (str.length <= 8) {
    return val;
  }

  return Number(val).toFixed(1);
}

export default function GetPointsWidget({
  communityName,
  symbol,
  checkAuth,
  openModalConvertPoint,
  className,
}) {
  const price = useGetPoints({ symbol });

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
              <Points>
                {smartRound(price)}&nbsp;
                <NameCP
                  aria-label={
                    communityName.length > MAX_COMMUNITY_SYMBOL_NAME_LENGTH
                      ? `${communityName}`
                      : null
                  }
                >
                  {symbolName}
                </NameCP>
              </Points>
            )}
          </ReceiveBlock>
          <Price>= 1 Commun</Price>
        </Prices>
        <ButtonWrapper>
          <FullButtonStyled onClick={onClick}>Get Points</FullButtonStyled>
          <SmallButtonStyled>Get</SmallButtonStyled>
        </ButtonWrapper>
      </Wrapper>
    </WidgetCardStyled>
  );
}

GetPointsWidget.propTypes = {
  symbol: PropTypes.string.isRequired,
  communityName: PropTypes.string.isRequired,

  checkAuth: PropTypes.func.isRequired,
  openModalConvertPoint: PropTypes.func.isRequired,
};
