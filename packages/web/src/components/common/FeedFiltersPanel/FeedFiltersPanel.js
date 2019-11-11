import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import {
  FEED_TYPE_COMMUNITY,
  FEED_TYPE_USER,
  FEED_TYPE_NEW,
  FEED_TYPE_HOT,
  FEED_TYPE_TOP_LIKES,
  FEED_TYPE_TOP_COMMENTS,
  FEED_TYPE_TOP_REWARDS,
  TIMEFRAME_DAY,
  TIMEFRAME_MONTH,
  TIMEFRAME_WEEK,
  TIMEFRAME_ALL,
  FEED_TYPES,
} from 'shared/constants';
import is from 'styled-is';

const FiltersPanel = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: #fff;

  ${up.mobileLandscape} {
    border-radius: 6px;
  }

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
  color: ${({ theme }) => theme.colors.gray};
`;

const Filter = styled.button`
  display: flex;
  align-items: center;
  padding: 7px 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 6px;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const ChevronIcon = styled(Icon).attrs({ name: 'triangle' })`
  width: 8px;
  height: 5px;
  margin-left: 7px;
  color: ${({ theme }) => theme.colors.gray};
`;

const MenuLink = styled.a`
  display: block;
  padding: 10px 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.15;
  color: #000;
  background-color: #fff;
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.background};
  }

  ${is('isActive')`
    color: ${({ theme, isCommunity }) =>
      isCommunity ? theme.colors.community : theme.colors.blue};

  `};
`;

@withTranslation()
@withRouter
export default class FeedFiltersPanel extends PureComponent {
  static propTypes = {
    router: PropTypes.shape({}).isRequired,
    params: PropTypes.shape({
      communityAlias: PropTypes.string,
    }).isRequired,
    defaultFeed: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
      FEED_TYPE_COMMUNITY,
      FEED_TYPE_USER,
      FEED_TYPE_NEW,
      FEED_TYPE_HOT,
      FEED_TYPE_TOP_LIKES,
      FEED_TYPE_TOP_COMMENTS,
      FEED_TYPE_TOP_REWARDS,
    ]).isRequired,
    timeframe: PropTypes.oneOf([TIMEFRAME_DAY, TIMEFRAME_WEEK, TIMEFRAME_MONTH, TIMEFRAME_ALL]),
    fetchPosts: PropTypes.func.isRequired,
  };

  static defaultProps = {
    timeframe: TIMEFRAME_WEEK,
  };

  handleChangeTimeframe = timeframe => {
    const {
      params,
      router: { query },
      fetchPosts,
    } = this.props;
    const type = query.feedSubType || query.feedType || FEED_TYPE_NEW;

    fetchPosts({
      ...params,
      type,
      timeframe,
    });
  };

  renderTypeFilter(feedFilters) {
    const {
      router: { query },
      t,
      defaultFeed,
    } = this.props;
    const feedType = query.feedType || defaultFeed;
    const type = query.feedSubType || feedFilters[0].type;

    return (
      <DropDownMenu
        openAt="bottom"
        handler={props => (
          <Filter {...props} name={`feed-filters__sort-by-${type}`}>
            {t(`type.${type}`)}
            <ChevronIcon />
          </Filter>
        )}
        items={() =>
          feedFilters.map(({ type: value }) => (
            <Link route="feed" params={{ feedType, feedSubType: value }} passHref key={value}>
              <MenuLink isActive={type === value} name={`feed-filters__sort-by-${value}`}>
                {t(`type.${value}`)}
              </MenuLink>
            </Link>
          ))
        }
      />
    );
  }

  renderTimeframeFilter(feedFilters) {
    const {
      router: { query },
      timeframe,
      t,
    } = this.props;
    const type = query.feedSubType || feedFilters[0].type;

    if (!type) {
      return null;
    }

    const filter = feedFilters.find(value => value.type === type);
    if (!filter || !filter.intervals) {
      return null;
    }

    return (
      <DropDownMenu
        openAt="bottom"
        handler={props => (
          <Filter {...props} name={`feed-filters__timeframe-${timeframe}`}>
            {t(`timeframe.${timeframe}`)}
            <ChevronIcon />
          </Filter>
        )}
        items={() =>
          filter.intervals.map(value => (
            <DropDownMenuItem
              key={value}
              isActive={timeframe === value}
              name={`feed-filters__timeframe-${value}`}
              onClick={() => this.handleChangeTimeframe(value)}
            >
              {t(`timeframe.${value}`)}
            </DropDownMenuItem>
          ))
        }
      />
    );
  }

  render() {
    const {
      router: { query },
      defaultFeed,
    } = this.props;

    const feedType = query.feedType || defaultFeed;
    const feedFilters = FEED_TYPES[feedType];

    if (!feedFilters) {
      return null;
    }

    return (
      <FiltersPanel>
        <Description>Sort:</Description>
        {this.renderTypeFilter(feedFilters)}
        {this.renderTimeframeFilter(feedFilters)}
      </FiltersPanel>
    );
  }
}
