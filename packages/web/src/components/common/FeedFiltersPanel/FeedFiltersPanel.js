import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import { withTranslation } from 'shared/i18n';
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
} from 'shared/constants';

const FEED_TYPES = [
  FEED_TYPE_NEW,
  FEED_TYPE_TOP_LIKES,
  FEED_TYPE_TOP_COMMENTS,
  FEED_TYPE_TOP_REWARDS,
];
const FEED_INTERVAL = [TIMEFRAME_DAY, TIMEFRAME_WEEK, TIMEFRAME_MONTH, TIMEFRAME_ALL];

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

@withTranslation()
export default class FeedFiltersPanel extends PureComponent {
  static propTypes = {
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

  handleChange = (field, typeValue) => {
    const { params, type, timeframe, fetchPosts } = this.props;

    fetchPosts({
      ...params,
      type,
      timeframe,
      [field]: typeValue,
    });
  };

  renderTypeFilter() {
    const { type, t } = this.props;

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
          FEED_TYPES.map(value => (
            <DropDownMenuItem
              key={value}
              isActive={type === value}
              name={`feed-filters__sort-by-${value}`}
              onClick={() => this.handleChange('type', value)}
            >
              {t(`type.${value}`)}
            </DropDownMenuItem>
          ))
        }
      />
    );
  }

  renderTimeframeFilter() {
    const { type, timeframe, t } = this.props;

    if (![FEED_TYPE_TOP_LIKES, FEED_TYPE_TOP_COMMENTS, FEED_TYPE_TOP_REWARDS].includes(type)) {
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
        {this.renderTypeFilter()}
        {this.renderTimeframeFilter()}
      </FiltersPanel>
    );
  }
}
