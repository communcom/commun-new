import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Avatar, TileGrid, Tile, Glyph, up } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';
import { formatNumber } from 'utils/format';

const Wrapper = styled(TileGrid)`
  padding: 10px;

  overflow-x: scroll;

  ${up.tablet} {
    flex-wrap: wrap;
    padding: 10px 0;

    overflow-x: hidden;
  }

  @media (min-width: 1140px) {
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
  font-size: 15px;
  font-weight: 600;
`;

const SecondaryText = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const PointsGrid = ({ className, communBalance, points, itemClickHandler, isDesktop }) => (
  <Wrapper className={className}>
    <PointsTile
      size={isDesktop ? 'xl' : 'large'}
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

    {Array.from(points.values()).map(({ symbol, balance, logo, name, frozen, price }) => (
      <PointsTile
        size={isDesktop ? 'xl' : 'large'}
        key={symbol}
        onItemClick={() => itemClickHandler(symbol)}
      >
        <AvatarWrapper size="large" avatarUrl={logo} name={name} />
        <PointInfo>
          <PointName>{name}</PointName>
          {frozen && <SecondaryText>{`${formatNumber(frozen)} on hold`}</SecondaryText>}
        </PointInfo>
        <PointBalance>
          <PointsAmount>
            {formatNumber(balance)} <SecondaryText>Points</SecondaryText>
          </PointsAmount>
          {price > 0 && <SecondaryText>{`= ${formatNumber(price)} Commun`}</SecondaryText>}
        </PointBalance>
      </PointsTile>
    ))}
  </Wrapper>
);

PointsGrid.propTypes = {
  communBalance: PropTypes.number,
  points: PropTypes.instanceOf(Map),
  itemClickHandler: PropTypes.func,
  isDesktop: PropTypes.bool.isRequired,
};

PointsGrid.defaultProps = {
  communBalance: 0,
  points: new Map(),
  itemClickHandler: undefined,
};

export default PointsGrid;
