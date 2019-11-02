/* eslint-disable class-methods-use-this */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TextButton, CheckBox, PaginationLoader } from '@commun/ui';

import { communityType } from 'types';
import { multiArgsMemoize } from 'utils/common';
import { displayError } from 'utils/toastsMessages';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import SearchInput from 'components/common/SearchInput';
import WidgetCommunityRow from 'components/widgets/common/WidgetCommunityRow';

import { WidgetCard, WidgetHeader, WidgetList } from '../common';

const SearchWrapper = styled.div`
  margin-bottom: 20px;
`;

export default class LeaderCommunitiesWidget extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    selectedCommunities: PropTypes.arrayOf(PropTypes.string).isRequired,
    isSelectedCommunitiesLoaded: PropTypes.bool.isRequired,
    fetchLeaderCommunities: PropTypes.func.isRequired,
    selectCommunity: PropTypes.func.isRequired,
    selectAllCommunities: PropTypes.func.isRequired,
    loadSelectedCommunities: PropTypes.func.isRequired,
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
    selectCommunity(community.communityId, checked);
  }

  onSelectAllClick = () => {
    const { selectAllCommunities } = this.props;
    selectAllCommunities(true);
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

    return (
      <WidgetCommunityRow
        community={community}
        actions={() => (
          <CheckBox
            checked={selectedCommunities.includes(community.communityId)}
            onChange={checked => this.onToggleCommunity(community, checked)}
          />
        )}
      />
    );
  }

  render() {
    const { items, isLoading, isEnd } = this.props;
    const { searchText } = this.state;

    let finalItems = items;
    const isFilterMode = Boolean(searchText.trim());

    if (isFilterMode) {
      finalItems = this.filterItems(finalItems, searchText);
    }

    return (
      <WidgetCard>
        <WidgetHeader
          title="Communities"
          link={<TextButton onClick={this.onSelectAllClick}>Select all</TextButton>}
        />
        <SearchWrapper>
          <SearchInput value={searchText} onChange={this.onSearchChange} />
        </SearchWrapper>
        <InfinityScrollHelper disabled={isLoading || isEnd} onNeedLoadMore={this.onNeedLoadMore}>
          <WidgetList>{finalItems.map(item => this.renderItem(item))}</WidgetList>
        </InfinityScrollHelper>
        {isLoading ? <PaginationLoader /> : null}
        {!isLoading && !isEnd && finalItems.length === 0 ? (
          <div>{isFilterMode ? 'Nothing is found' : 'No communities'}</div>
        ) : null}
      </WidgetCard>
    );
  }
}
