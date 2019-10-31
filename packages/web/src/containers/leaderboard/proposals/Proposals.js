import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import ProposalCard from 'components/leaderBoard/ProposalCard';

const Wrapper = styled.div``;

export default class Proposals extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    fetchLeaderProposals: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.fetchData();
  }

  onNeedLoadMore = () => {
    this.fetchData(true);
  };

  async fetchData(isPaging) {
    const { order, fetchLeaderProposals } = this.props;

    const params = {
      communitiesIds: ['TCRSS'],
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
    const { isLoading, isEnd } = this.props;

    return (
      <Wrapper>
        <InfinityScrollHelper disabled={isLoading || isEnd} onNeedLoadMore={this.onNeedLoadMore}>
          {this.renderItems()}
        </InfinityScrollHelper>
      </Wrapper>
    );
  }
}
