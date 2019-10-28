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
  FEED_TYPE_TOP_LIKES,
  FEED_TYPE_TOP_COMMENTS,
  FEED_TYPE_TOP_REWARDS,
  TIMEFRAME_DAY,
  TIMEFRAME_MONTH,
  TIMEFRAME_WEEK,
  TIMEFRAME_ALL,
  FEED_TYPES,
  FEED_INTERVAL,
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
`;

const ChevronIcon = styled(Icon).attrs({ name: 'triangle' })`
  width: 8px;
  height: 5px;
  margin-left: 7px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const MenuLink = styled.a`
  display: block;
  padding: 10px 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  font-weight: 600;
  color: #000;
  background-color: #fff;
  transition: background-color 0.15s;
  text-align: center;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.contextWhite};
  }

  ${is('isActive')`
    color: ${({ theme, isCommunity }) =>
      isCommunity ? theme.colors.communityColor : theme.colors.contextBlue};

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
    type: PropTypes.oneOf([
      FEED_TYPE_COMMUNITY,
      FEED_TYPE_USER,
      FEED_TYPE_NEW,
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

  renderTypeFilter() {
    const {
      router: { query },
      type,
      t,
    } = this.props;
    const feedType = query.feedType || FEED_TYPE_NEW;

    if (!FEED_TYPES[feedType]) {
      return null;
    }

    if (query.feedSubType && !FEED_TYPES[feedType].includes(query.feedSubType)) {
      return null;
    }

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
          FEED_TYPES[feedType].map(value => (
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

  renderTimeframeFilter() {
    const {
      router: { query },
      timeframe,
      t,
    } = this.props;

    if (
      !query.feedSubType ||
      ![FEED_TYPE_TOP_LIKES, FEED_TYPE_TOP_COMMENTS, FEED_TYPE_TOP_REWARDS].includes(
        query.feedSubType
      )
    ) {
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
          FEED_INTERVAL.map(value => (
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
    } = this.props;
    const type = query.feedType;

    if (!type || type === FEED_TYPE_NEW) {
      return null;
    }

    return (
      <FiltersPanel>
        <Description>Sort:</Description>
        {this.renderTypeFilter()}
        {this.renderTimeframeFilter()}
      </FiltersPanel>
    );
  }
}
