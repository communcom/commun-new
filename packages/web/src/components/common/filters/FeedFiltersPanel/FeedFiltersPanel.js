import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import styled from 'styled-components';

import { TIMEFRAME_ALL, TIMEFRAME_DAY, TIMEFRAME_MONTH, TIMEFRAME_WEEK } from 'shared/constants';
import { FEATURE_TAGS } from 'shared/featureFlags';
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

const WrapperStyled = styled(Wrapper)`
  & {
    flex-direction: column;
    align-items: stretch;
    height: auto;
    padding: 0;
  }
`;

const Filters = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 15px;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const Tags = styled.div`
  display: flex;
  align-items: center;
  height: 62px;
  padding: 0 15px;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGrayBlue};
`;

const TagLink = styled.a`
  padding: 6px 12px;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.blue};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 6px;

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

@injectFeatureToggles([FEATURE_TAGS])
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
    featureToggles: PropTypes.object.isRequired,
  };

  static defaultProps = {
    timeframe: TIMEFRAME_WEEK,
  };

  renderTypeFilter() {
    const { feedFilters, feedType, type, t } = this.props;
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
          feedFilters.map(({ type: value }) => (
            <Link route="feed" params={{ feedType, feedSubType: value }} passHref key={value}>
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
    const { feedFilters, feedType, timeframe, type, t } = this.props;

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
            {t(`filters.timeframe.${timeframe}`)}
            <ChevronIcon />
          </Filter>
        )}
        items={() =>
          filter.intervals.map(value => (
            <Link
              route="feed"
              params={{ feedType, feedSubType: type, feedSubSubType: value }}
              passHref
              key={value}
            >
              <MenuLink isActive={timeframe === value} name={`feed-filters__timeframe-${value}`}>
                {t(`filters.timeframe.${value}`)}
              </MenuLink>
            </Link>
          ))
        }
      />
    );
  }

  render() {
    const { feedFilters, t, featureToggles } = this.props;

    if (feedFilters.length === 1) {
      return null;
    }

    return (
      <WrapperStyled>
        <Filters>
          <Description>{t('filters.sort')}:</Description>
          {this.renderTypeFilter()}
          {this.renderTimeframeFilter()}
        </Filters>
        {featureToggles[FEATURE_TAGS] ? (
          <Tags>
            {['Bitcoin', 'Blockchain', 'Belarus', 'Photography'].map(tag => (
              <Link route="search" params={{ q: `${encodeURI('#')}${tag}` }} passHref>
                <TagLink>#{tag}</TagLink>
              </Link>
            ))}
          </Tags>
        ) : null}
      </WrapperStyled>
    );
  }
}
