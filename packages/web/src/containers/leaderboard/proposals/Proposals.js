import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaginationLoader, up } from '@commun/ui';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import ProposalCard from 'components/leaderBoard/ProposalCard';
import EmptyList from 'components/common/EmptyList';

const Wrapper = styled.div`
  margin-bottom: 30px;
`;

const EmptyListStyled = styled(EmptyList)`
  border-radius: 6px;

  ${up.desktop} {
    height: 217px;
  }
`;

export default class Proposals extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    selectedCommunities: PropTypes.arrayOf(PropTypes.string),
    fetchLeaderProposals: PropTypes.func.isRequired,
    compareSelectedCommunities: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedCommunities: undefined,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { selectedCommunities, compareSelectedCommunities } = this.props;

    if (!compareSelectedCommunities(prevProps.selectedCommunities, selectedCommunities)) {
      this.fetchData('select');
    }
  }

  onNeedLoadMore = () => {
    this.fetchData('pagination');
  };

  async fetchData(type) {
    const { order, selectedCommunities, fetchLeaderProposals } = this.props;

    if (!selectedCommunities) {
      return;
    }

    const params = {
      communityIds: selectedCommunities,
    };

    if (type === 'pagination') {
      params.offset = order.length;
    }

    if (type === 'select') {
      params.stayCurrentData = true;
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
        {!isLoading && isEnd && order.length === 0 ? (
          <EmptyListStyled
            monkey
            headerText="No proposals"
            subText="There are no suggestions in the community"
          />
        ) : null}
      </Wrapper>
    );
  }
}
