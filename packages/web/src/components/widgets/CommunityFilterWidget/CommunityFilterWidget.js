/* eslint-disable class-methods-use-this */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CheckBox, PaginationLoader, TextButton } from '@commun/ui';

import { communityType } from 'types';
import { withTranslation } from 'shared/i18n';
import { multiArgsMemoize } from 'utils/common';
import { displayError } from 'utils/toastsMessages';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import SearchInput from 'components/common/SearchInput';
import WidgetCommunityRow from 'components/widgets/common/WidgetCommunityRow';
import { WidgetCard, WidgetHeader, WidgetList } from '../common';

const SearchWrapper = styled.div`
  margin-bottom: 20px;
`;

const TextButtonStyled = styled(TextButton)`
  margin-right: -10px;
`;

const PaginationLoaderStyled = styled(PaginationLoader)`
  & svg {
    width: 30px;
    height: 30px;
  }
`;

@withTranslation()
export default class CommunityFilterWidget extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    selectedCommunities: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    isSelectedCommunitiesLoaded: PropTypes.bool.isRequired,
    fetchLeaderCommunities: PropTypes.func.isRequired,
    selectCommunity: PropTypes.func.isRequired,
    clearCommunityFilter: PropTypes.func.isRequired,
    loadSelectedCommunities: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedCommunities: [],
  };

  state = {
    searchText: '',
  };

  filterItems = multiArgsMemoize((items, text) => {
    const lowerText = text.trim().toLowerCase();
    return items.filter(item => item.name.toLowerCase().startsWith(lowerText));
  });

  componentDidMount() {
    const { isSelectedCommunitiesLoaded, loadSelectedCommunities } = this.props;

    if (!isSelectedCommunitiesLoaded) {
      loadSelectedCommunities();
    }

    this.fetchData();
  }

  onNeedLoadMore = () => {
    this.fetchData(true);
  };

  onSearchChange = e => {
    this.setState({
      searchText: e.target.value,
    });
  };

  onToggleCommunity(community, checked) {
    const { selectCommunity } = this.props;
    selectCommunity({
      communityId: community.communityId,
      action: checked ? 'add' : 'remove',
    });
  }

  onSelectAllClick = () => {
    const { clearCommunityFilter } = this.props;
    clearCommunityFilter(true);
  };

  async fetchData(isPaging) {
    const { items, fetchLeaderCommunities } = this.props;

    const params = {};

    if (isPaging) {
      params.offset = items.length;
    }

    try {
      await fetchLeaderCommunities(params);
    } catch (err) {
      displayError(err);
    }
  }

  renderItem(community) {
    const { selectedCommunities } = this.props;

    const checked = selectedCommunities && selectedCommunities.includes(community.communityId);

    return (
      <WidgetCommunityRow
        key={community.communityId}
        community={community}
        actions={() => (
          <CheckBox
            checked={checked}
            onChange={isChecked => this.onToggleCommunity(community, isChecked)}
          />
        )}
      />
    );
  }

  render() {
    const { items, isLoading, isEnd, t, className } = this.props;
    const { searchText } = this.state;

    let finalItems = items;
    const isFilterMode = Boolean(searchText.trim());

    if (isFilterMode) {
      finalItems = this.filterItems(finalItems, searchText);
    }

    return (
      <WidgetCard className={className}>
        <WidgetHeader
          title={t('widgets.community_filter.title')}
          right={
            <TextButtonStyled onClick={this.onSelectAllClick}>
              {t('widgets.community_filter.clear')}
            </TextButtonStyled>
          }
        />
        <SearchWrapper>
          <SearchInput
            placeholder={t('common.search_placeholder')}
            value={searchText}
            onChange={this.onSearchChange}
          />
        </SearchWrapper>
        <InfinityScrollHelper disabled={isLoading || isEnd} onNeedLoadMore={this.onNeedLoadMore}>
          <WidgetList>{finalItems.map(item => this.renderItem(item))}</WidgetList>
        </InfinityScrollHelper>
        {isLoading ? <PaginationLoaderStyled /> : null}
        {!isLoading && isEnd && finalItems.length === 0 ? (
          <div>
            {isFilterMode
              ? t('widgets.community_filter.no_found')
              : t('widgets.community_filter.empty')}
          </div>
        ) : null}
      </WidgetCard>
    );
  }
}
