import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import {
  TIMEFRAME_DAY,
  TIMEFRAME_MONTH,
  TIMEFRAME_WEEK,
  TIMEFRAME_ALL,
  FEED_COMMUNITY_TYPES,
} from 'shared/constants';
import {
  Wrapper,
  Filter,
  MenuLink,
  ChevronIcon,
  Description,
} from 'components/common/filters/common/Filter.styled';

@withTranslation()
export default class FeedCommunityFiltersPanel extends PureComponent {
  static propTypes = {
    params: PropTypes.shape({
      communityAlias: PropTypes.string,
    }).isRequired,
    feedFilter: PropTypes.shape({}).isRequired,
    type: PropTypes.string.isRequired,
    timeframe: PropTypes.oneOf([TIMEFRAME_DAY, TIMEFRAME_WEEK, TIMEFRAME_MONTH, TIMEFRAME_ALL]),
    fetchPosts: PropTypes.func.isRequired,
  };

  static defaultProps = {
    timeframe: TIMEFRAME_WEEK,
  };

  handleChangeTimeframe = timeframe => {
    const { params, type, fetchPosts } = this.props;

    fetchPosts({
      ...params,
      type,
      timeframe,
    });
  };

  renderTypeFilter() {
    const {
      params: { communityAlias },
      type,
      t,
    } = this.props;

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
          FEED_COMMUNITY_TYPES.map(({ type: value }) => (
            <Link
              route="community"
              params={{ communityAlias, section: 'feed', subSection: value }}
              passHref
              key={value}
            >
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
    const { feedFilter, timeframe, t } = this.props;

    if (!feedFilter.intervals) {
      return null;
    }

    return (
      <DropDownMenu
        openAt="bottom"
        handler={props => (
          <Filter {...props} name={`feed-community-filters__timeframe-${timeframe}`}>
            {t(`timeframe.${timeframe}`)}
            <ChevronIcon />
          </Filter>
        )}
        items={() =>
          feedFilter.intervals.map(value => (
            <DropDownMenuItem
              key={value}
              isActive={timeframe === value}
              name={`feed-community-filters__timeframe-${value}`}
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
    const { feedFilter } = this.props;

    if (!feedFilter) {
      return null;
    }

    return (
      <Wrapper>
        <Description>Sort:</Description>
        {this.renderTypeFilter()}
        {this.renderTimeframeFilter()}
      </Wrapper>
    );
  }
}
