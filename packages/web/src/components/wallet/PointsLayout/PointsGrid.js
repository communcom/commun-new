import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TileGrid, Tile, up } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';
import { formatNumber } from 'utils/format';

import PointAvatar from '../PointAvatar';

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

const PointAvatarStyled = styled(PointAvatar)`
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

const PointsGrid = ({ className, points, itemClickHandler, isDesktop }) => (
  <Wrapper className={className}>
    {points.map(({ symbol, balance, logo, name, frozen, price }) => (
      <PointsTile
        size={isDesktop ? 'xl' : 'large'}
        key={symbol}
        onItemClick={() => itemClickHandler(symbol)}
      >
        <PointAvatarStyled point={{ symbol, logo, name }} />
        <PointInfo>
          <PointName>{name}</PointName>
          {frozen && <SecondaryText>{`${formatNumber(frozen)} on hold`}</SecondaryText>}
        </PointInfo>
        <PointBalance>
          <PointsAmount>
            {formatNumber(balance)}{' '}
            <SecondaryText>{symbol === COMMUN_SYMBOL ? 'Tokens' : 'Points'}</SecondaryText>
          </PointsAmount>
          {price > 0 && <SecondaryText>{`= ${formatNumber(price)} Commun`}</SecondaryText>}
        </PointBalance>
      </PointsTile>
    ))}
  </Wrapper>
);

PointsGrid.propTypes = {
  points: PropTypes.arrayOf(PropTypes.object),
  itemClickHandler: PropTypes.func,
  isDesktop: PropTypes.bool.isRequired,
};

PointsGrid.defaultProps = {
  points: [],
  itemClickHandler: undefined,
};

export default PointsGrid;
