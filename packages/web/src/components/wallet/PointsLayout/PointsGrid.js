import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Avatar, TileGrid, Tile, Glyph, up } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';
import { pointsArrayType } from 'types/common';
import { formatNumber } from 'utils/format';

const Wrapper = styled(TileGrid)`
  padding: 10px;

  overflow-x: scroll;

  ${up.tablet} {
    padding: 10px 0;
  }

  ${up.desktop} {
    flex-wrap: wrap;

    & > :nth-of-type(3n) {
      margin-right: 0;
    }
  }
`;

const PointsTile = styled(Tile)`
  margin-bottom: 10px;

  background: #fff;
  border-radius: 10px;
  cursor: pointer;
`;

const AvatarWrapper = styled(Avatar)`
  margin-bottom: 10px;
`;

const GlyphWrapper = styled(Glyph).attrs({ icon: 'commun' })`
  margin-bottom: 10px;
`;

const PointInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const PointName = styled.div`
  margin-bottom: 3px;

  font-size: 17px;
  font-weight: 600;

  ${up.desktop} {
    font-size: 14px;
  }
`;

const PointBalance = styled.div`
  display: flex;
  flex-direction: column;
`;

const PointsAmount = styled.div`
  font-size: 20px;
  font-weight: 600;

  ${up.desktop} {
    font-size: 18px;
  }
`;

const SecondaryText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const PointsGrid = ({ className, communBalance, points, itemClickHandler, isMobile }) => (
  <Wrapper className={className}>
    <PointsTile
      size={isMobile ? 'large' : 'xl'}
      key="commun"
      onItemClick={() => itemClickHandler(COMMUN_SYMBOL)}
    >
      <GlyphWrapper icon="commun" />
      <PointInfo>
        <PointName>Commun</PointName>
      </PointInfo>
      <PointBalance>
        <PointsAmount>
          {formatNumber(communBalance)} <SecondaryText>Tokens</SecondaryText>
        </PointsAmount>
      </PointBalance>
    </PointsTile>

    {points.map(({ symbol, balance, logo, name, frozen, price }) => (
      <PointsTile
        size={isMobile ? 'large' : 'xl'}
        key={symbol}
        onItemClick={() => itemClickHandler(symbol)}
      >
        <AvatarWrapper size="large" avatarUrl={logo} name={name} />
        <PointInfo>
          <PointName>{name}</PointName>
          {frozen && <SecondaryText>{`${Math.round(frozen)} on hold`}</SecondaryText>}
        </PointInfo>
        <PointBalance>
          <PointsAmount>
            {formatNumber(Math.round(balance))} <SecondaryText>Points</SecondaryText>
          </PointsAmount>
          {price > 0 && <SecondaryText>{`= ${Math.round(price)} Commun`}</SecondaryText>}
        </PointBalance>
      </PointsTile>
    ))}
  </Wrapper>
);

PointsGrid.propTypes = {
  communBalance: PropTypes.number,
  points: pointsArrayType,
  itemClickHandler: PropTypes.func,
  isMobile: PropTypes.bool.isRequired,
};

PointsGrid.defaultProps = {
  communBalance: 0,
  points: [],
  itemClickHandler: undefined,
};

export default PointsGrid;
