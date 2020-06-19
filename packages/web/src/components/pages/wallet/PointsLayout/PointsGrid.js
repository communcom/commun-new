import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { KEY_CODES, styles, Tile, TileGrid, up } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { formatMoney } from 'utils/format';

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
  position: relative;
  margin-bottom: 10px;
  padding: 13px;

  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid transparent;
  cursor: pointer;

  ${is('isActive')`
    border: 2px solid ${({ theme }) => theme.colors.blue};
  `};
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
  line-height: 20px;
  ${styles.overflowEllipsis};

  ${up.desktop} {
    font-size: 14px;
    white-space: unset;
    overflow: unset;
    text-overflow: unset;
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

const PointsGrid = ({ points, selectedPoint, isDesktop, className, onSelectionChange }) => {
  const { t } = useTranslation();

  function onTileClick(e) {
    const selectedSymbol = e.currentTarget.dataset.symbol;
    onSelectionChange(selectedSymbol);
  }

  function onKeyDown(e) {
    if (e.which === KEY_CODES.TAB) {
      setTimeout(() => {
        const activeSymbol = document.activeElement.dataset.symbol;
        if (activeSymbol) {
          onSelectionChange(activeSymbol);
        }
      }, 0);
    }
  }

  const stopAutoFocusing = process.browser
    ? document.activeElement && document.activeElement.tagName === 'INPUT'
    : false;

  return (
    <Wrapper className={className} onKeyDown={onKeyDown}>
      {points.map(({ symbol, balance, logo, name, frozen, price }, index) => (
        <PointsTile
          key={symbol}
          data-symbol={symbol}
          tabIndex="0"
          autoFocus={index === 0 && !stopAutoFocusing}
          size={isDesktop ? 'xl' : 'large'}
          isActive={selectedPoint && selectedPoint === symbol}
          onClick={onTileClick}
        >
          <PointAvatarStyled point={{ symbol, logo, name }} />
          <PointInfo>
            <PointName>{name}</PointName>
            {frozen && (
              <SecondaryText>
                {t('components.wallet.points_grid.on_hold', { quantity: Number(frozen) })}
              </SecondaryText>
            )}
          </PointInfo>
          <PointBalance>
            <PointsAmount>
              {formatMoney(balance)}{' '}
              <SecondaryText>
                {symbol === COMMUN_SYMBOL
                  ? t('common.token', { count: Number(balance) })
                  : t('common.point', { count: Number(balance) })}
              </SecondaryText>
            </PointsAmount>
            {price > 0 && <SecondaryText>{`= ${formatMoney(price)} Commun`}</SecondaryText>}
          </PointBalance>
        </PointsTile>
      ))}
    </Wrapper>
  );
};

PointsGrid.propTypes = {
  points: PropTypes.arrayOf(PropTypes.object),
  selectedPoint: PropTypes.string,
  onSelectionChange: PropTypes.func,
  isDesktop: PropTypes.bool.isRequired,
};

PointsGrid.defaultProps = {
  selectedPoint: null,
  points: [],
  onSelectionChange: undefined,
};

export default PointsGrid;
