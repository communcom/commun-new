import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaginationLoader } from '@commun/ui';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import ProposalCard from 'components/leaderBoard/ProposalCard';
import EmptyBlock from 'components/leaderBoard/EmptyBlock';

const Wrapper = styled.div``;

export default class Proposals extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    selectedCommunities: PropTypes.arrayOf(PropTypes.string).isRequired,
    fetchLeaderProposals: PropTypes.func.isRequired,
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
    const { order, selectedCommunities, clearLeaderBoard, fetchLeaderProposals } = this.props;

    if (!selectedCommunities) {
      return;
    }

    if (selectedCommunities.length === 0) {
      clearLeaderBoard();
      return;
    }

    const params = {
      communitiesIds: selectedCommunities,
    };

    if (isPaging) {
      params.offset = order.length;
    }

    try {
      await fetchLeaderProposals(params);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Proposals fetching failed:', err);
    }
  }

  renderItems() {
    const { order } = this.props;

    return order.map(proposalId => <ProposalCard key={proposalId} proposalId={proposalId} />);
  }

  render() {
    const { order, isLoading, isEnd } = this.props;

    return (
      <Wrapper>
        <InfinityScrollHelper disabled={isLoading || isEnd} onNeedLoadMore={this.onNeedLoadMore}>
          {this.renderItems()}
        </InfinityScrollHelper>
        {isLoading ? <PaginationLoader /> : null}
        {!isLoading && isEnd && order.length === 0 ? <EmptyBlock>No proposals</EmptyBlock> : null}
      </Wrapper>
    );
  }
}
