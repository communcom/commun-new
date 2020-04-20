import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaginationLoader, up } from '@commun/ui';
import { withTranslation } from 'shared/i18n';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import ProposalCard from 'components/leaderBoard/ProposalCard';
import EmptyList from 'components/common/EmptyList';
import LazyLoad from 'components/common/LazyLoad';
import PageLoader from 'components/common/PageLoader';

const Wrapper = styled.div`
  margin-bottom: 30px;
`;

const EmptyListStyled = styled(EmptyList)`
  border-radius: 6px;

  ${up.desktop} {
    height: 217px;
  }
`;

@withTranslation()
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

    return order.map(proposalId => (
      <LazyLoad key={proposalId} height={402} offset={300}>
        <ProposalCard proposalId={proposalId} />
      </LazyLoad>
    ));
  }

  render() {
    const { order, isLoading, isEnd, t } = this.props;

    if (!order.length && isLoading) {
      return <PageLoader isStatic />;
    }

    return (
      <Wrapper>
        <InfinityScrollHelper disabled={isLoading || isEnd} onNeedLoadMore={this.onNeedLoadMore}>
          {this.renderItems()}
        </InfinityScrollHelper>
        {isLoading ? <PaginationLoader /> : null}
        {!isLoading && isEnd && order.length === 0 ? (
          <EmptyListStyled
            monkey
            headerText={t('components.leaderboard.proposals.no_found')}
            subText={t('components.leaderboard.proposals.no_found_desc')}
          />
        ) : null}
      </Wrapper>
    );
  }
}
