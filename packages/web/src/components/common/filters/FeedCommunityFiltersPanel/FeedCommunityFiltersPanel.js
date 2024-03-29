import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  FEED_COMMUNITY_TYPES,
  TIMEFRAME_ALL,
  TIMEFRAME_DAY,
  TIMEFRAME_MONTH,
  TIMEFRAME_WEEK,
} from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

import DropDownMenu from 'components/common/DropDownMenu';
import {
  ChevronIcon,
  Description,
  Filter,
  MenuLink,
  Wrapper,
} from 'components/common/filters/common/Filter.styled';

@withTranslation()
export default class FeedCommunityFiltersPanel extends PureComponent {
  static propTypes = {
    params: PropTypes.shape({
      communityAlias: PropTypes.string,
    }).isRequired,
    feedFilter: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    timeframe: PropTypes.oneOf([TIMEFRAME_DAY, TIMEFRAME_WEEK, TIMEFRAME_MONTH, TIMEFRAME_ALL]),
    fetchPosts: PropTypes.func.isRequired,
  };

  static defaultProps = {
    timeframe: TIMEFRAME_WEEK,
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
            {t(`filters.type.${type}`)}
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
                {t(`filters.type.${value}`)}
              </MenuLink>
            </Link>
          ))
        }
      />
    );
  }

  renderTimeframeFilter() {
    const {
      params: { communityAlias },
      feedFilter,
      timeframe,
      type,
      t,
    } = this.props;

    if (!feedFilter.intervals) {
      return null;
    }

    return (
      <DropDownMenu
        openAt="bottom"
        handler={props => (
          <Filter {...props} name={`feed-community-filters__timeframe-${timeframe}`}>
            {t(`filters.timeframe.${timeframe}`)}
            <ChevronIcon />
          </Filter>
        )}
        items={() =>
          feedFilter.intervals.map(value => (
            <Link
              route="community"
              params={{ communityAlias, section: 'feed', subSection: type, subSubSection: value }}
              passHref
              key={value}
            >
              <MenuLink
                isActive={timeframe === value}
                name={`feed-community-filters__timeframe-${timeframe}`}
              >
                {t(`filters.timeframe.${value}`)}
              </MenuLink>
            </Link>
          ))
        }
      />
    );
  }

  render() {
    const { feedFilter, t } = this.props;

    if (!feedFilter) {
      return null;
    }

    return (
      <Wrapper>
        <Description>{t('filters.sort')}:</Description>
        {this.renderTypeFilter()}
        {this.renderTimeframeFilter()}
      </Wrapper>
    );
  }
}
