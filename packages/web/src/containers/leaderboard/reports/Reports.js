import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaginationLoader } from '@commun/ui';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import PostCard from 'components/common/PostCard';
import EmptyBlock from 'components/leaderBoard/EmptyBlock/EmptyBlock';

const Wrapper = styled.div``;

export default class Reports extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    selectedCommunities: PropTypes.arrayOf(PropTypes.string).isRequired,
    fetchReportsList: PropTypes.func.isRequired,
    clearLeaderBoard: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { selectedCommunities } = this.props;

    if (prevProps.selectedCommunities !== selectedCommunities) {
      this.fetchData();
    }
  }

  onNeedLoadMore = () => {
    this.fetchData(true);
  };

  async fetchData(isPaging) {
    const { order, selectedCommunities, clearLeaderBoard, fetchReportsList } = this.props;

    if (!selectedCommunities) {
      return;
    }

    if (selectedCommunities.length === 0) {
      clearLeaderBoard();
      return;
    }

    const params = {
      communityIds: selectedCommunities,
    };

    if (isPaging) {
      params.offset = order.length;
    }

    try {
      await fetchReportsList(params);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Proposals fetching failed:', err);
    }
  }

  renderItems() {
    const { order } = this.props;

    return order.map(reportId => <PostCard key={reportId} postId={reportId} isShowReports />);
  }

  render() {
    const { order, isLoading, isEnd } = this.props;

    return (
      <Wrapper>
        <InfinityScrollHelper disabled={isLoading || isEnd} onNeedLoadMore={this.onNeedLoadMore}>
          {this.renderItems()}
        </InfinityScrollHelper>
        {isLoading ? <PaginationLoader /> : null}
        {!isLoading && isEnd && order.length === 0 ? <EmptyBlock>No reports</EmptyBlock> : null}
      </Wrapper>
    );
  }
}
