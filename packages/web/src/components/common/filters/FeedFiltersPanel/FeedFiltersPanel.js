import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import { TIMEFRAME_DAY, TIMEFRAME_MONTH, TIMEFRAME_WEEK, TIMEFRAME_ALL } from 'shared/constants';
import {
  Wrapper,
  Filter,
  MenuLink,
  ChevronIcon,
  Description,
} from 'components/common/filters/common/Filter.styled';

@withTranslation()
export default class FeedFiltersPanel extends PureComponent {
  static propTypes = {
    params: PropTypes.shape({
      userId: PropTypes.string,
    }).isRequired,
    feedFilters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    feedType: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    timeframe: PropTypes.oneOf([TIMEFRAME_DAY, TIMEFRAME_WEEK, TIMEFRAME_MONTH, TIMEFRAME_ALL]),
    fetchPosts: PropTypes.func.isRequired,
  };

  static defaultProps = {
    timeframe: TIMEFRAME_WEEK,
  };

  handleChangeTimeframe = timeframe => {
    const { type, params, fetchPosts } = this.props;

    fetchPosts({
      ...params,
      type,
      timeframe,
    });
  };

  renderTypeFilter() {
    const { feedFilters, feedType, type, t } = this.props;
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

  renderTimeframeFilter() {
    const { feedFilters, timeframe, type, t } = this.props;

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
    const { feedFilters } = this.props;

    if (!feedFilters) {
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
