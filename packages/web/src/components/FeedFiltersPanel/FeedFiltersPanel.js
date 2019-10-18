import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import DropDownMenu, { DropDownMenuItem } from 'components/DropDownMenu';
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
  height: 50px;
  padding: 10px 15px;
  margin: 10px 0;
  background-color: #fff;
  border-radius: 6px;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const Description = styled.span`
  && {
    margin-right: 16px;
  }
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const Filter = styled.button`
  display: flex;
  align-items: center;
  padding: 7px 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;
  background-color: ${({ theme }) => theme.colors.contextWhite};
  border-radius: 6px;
  transition: color 0.15s;

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
  color: ${({ theme }) => theme.colors.contextGrey};
`;

@withNamespaces()
export default class FeedFiltersPanel extends PureComponent {
  static propTypes = {
    params: PropTypes.shape({
      type: PropTypes.oneOf(['community', 'user']).isRequired,
      communityAlias: PropTypes.string.isRequired,
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
      <DropDownMenu
        openAt="bottom"
        handler={props => (
          <Filter {...props} name={`feed-filters__sort-by-${sortBy}`} isCommunity={isCommunity}>
            {t(`sortBy.${sortBy}`)}
            <ChevronIcon />
          </Filter>
        )}
        items={() =>
          FEED_TYPES.map(value => (
            <DropDownMenuItem
              key={value}
              isCommunity={isCommunity}
              isActive={sortBy === value}
              name={`feed-filters__sort-by-${value}`}
              onClick={() => this.handleChange('sortBy', value)}
            >
              {t(`sortBy.${value}`)}
            </DropDownMenuItem>
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
      <DropDownMenu
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
            <DropDownMenuItem
              key={value}
              isCommunity={isCommunity}
              isActive={timeframe === value}
              name={`feed-filters__timeframe-${value}`}
              onClick={() => this.handleChange('timeframe', value)}
            >
              {t(`timeframe.${value}`)}
            </DropDownMenuItem>
          ))
        }
      />
    );
  }

  render() {
    return (
      <FiltersPanel>
        <Description>Sort:</Description>
        {this.renderSortByFilter()}
        {this.renderTimeframeFilter()}
      </FiltersPanel>
    );
  }
}
