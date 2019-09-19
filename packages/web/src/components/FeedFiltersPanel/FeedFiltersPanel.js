import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';

import { Icon } from '@commun/icons';
import ContextMenu, { ContextMenuItem } from 'components/ContextMenu';
import { withNamespaces } from 'shared/i18n';
import {
  SORT_BY_NEWEST,
  SORT_BY_OLDEST,
  SORT_BY_POPULAR,
  TIMEFRAME_DAY,
  TIMEFRAME_MONTH,
  TIMEFRAME_WEEK,
  TIMEFRAME_YEAR,
  TIMEFRAME_ALL,
  TIMEFRAME_WILSONHOT,
  TIMEFRAME_WILSONTRENDING,
} from 'shared/constants';

const FEED_INTERVAL = [
  TIMEFRAME_DAY,
  TIMEFRAME_WEEK,
  TIMEFRAME_MONTH,
  TIMEFRAME_YEAR,
  TIMEFRAME_ALL,
  TIMEFRAME_WILSONHOT,
  TIMEFRAME_WILSONTRENDING,
];

const FiltersPanel = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  padding: 0 14px;

  & > :not(:last-child) {
    margin-right: 16px;
  }

  ${up('mobileLandscape')} {
    padding: 0 3px;
  }
`;

const Description = styled.span`
  font-size: 11px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const Filter = styled.button`
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: -0.31px;
  color: ${({ theme }) => theme.colors.contextBlue};

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }

  ${is('isCommunity')`
    color: ${({ theme }) => theme.colors.communityColor};

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.communityColorHover};
    }
  `};
`;

const ChevronIcon = styled(Icon).attrs({ name: 'triangle' })`
  width: 8px;
  height: 5px;
  margin-left: 7px;
`;

@withNamespaces()
export default class FeedFiltersPanel extends PureComponent {
  static propTypes = {
    params: PropTypes.shape({
      type: PropTypes.oneOf(['community', 'user']).isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
    sortBy: PropTypes.string.isRequired,
    timeframe: PropTypes.string.isRequired,
    isCommunity: PropTypes.bool,
    fetchPosts: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isCommunity: false,
  };

  handleChange = (type, typeValue) => {
    const { fetchPosts, params } = this.props;

    fetchPosts({
      ...params,
      [type]: typeValue,
    });
  };

  renderSortByFilter() {
    const {
      params: { type },
      sortBy,
      isCommunity,
      t,
    } = this.props;

    const FEED_TYPES = [SORT_BY_NEWEST, SORT_BY_OLDEST];
    if (type === 'community') {
      FEED_TYPES.push(SORT_BY_POPULAR);
    }

    return (
      <ContextMenu
        openAt="bottom"
        handler={props => (
          <Filter {...props} name={`feed-filters__sort-by-${sortBy}`} isCommunity={isCommunity}>
            {t(`sortBy.${sortBy}`)}
            <ChevronIcon />
          </Filter>
        )}
        items={() =>
          FEED_TYPES.map(value => (
            <ContextMenuItem
              key={value}
              isCommunity={isCommunity}
              isActive={sortBy === value}
              name={`feed-filters__sort-by-${value}`}
              onClick={() => this.handleChange('sortBy', value)}
            >
              {t(`sortBy.${value}`)}
            </ContextMenuItem>
          ))
        }
      />
    );
  }

  renderTimeframeFilter() {
    const {
      params: { type },
      sortBy,
      timeframe,
      isCommunity,
      t,
    } = this.props;

    if (type !== 'community' || sortBy !== SORT_BY_POPULAR) {
      return null;
    }

    return (
      <ContextMenu
        openAt="bottom"
        handler={props => (
          <Filter
            {...props}
            name={`feed-filters__timeframe-${timeframe}`}
            isCommunity={isCommunity}
          >
            {t(`timeframe.${timeframe}`)}
            <ChevronIcon />
          </Filter>
        )}
        items={() =>
          FEED_INTERVAL.map(value => (
            <ContextMenuItem
              key={value}
              isCommunity={isCommunity}
              isActive={timeframe === value}
              name={`feed-filters__timeframe-${value}`}
              onClick={() => this.handleChange('timeframe', value)}
            >
              {t(`timeframe.${value}`)}
            </ContextMenuItem>
          ))
        }
      />
    );
  }

  render() {
    return (
      <FiltersPanel>
        <Description>SORT:</Description>
        {this.renderSortByFilter()}
        {this.renderTimeframeFilter()}
      </FiltersPanel>
    );
  }
}
