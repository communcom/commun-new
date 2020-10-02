import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaginationLoader, up } from '@commun/ui';

import { ProposalsSubTab } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { captureException } from 'utils/errors';

import EmptyList from 'components/common/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import LazyLoad from 'components/common/LazyLoad';
import PageLoader from 'components/common/PageLoader';
import ProposalCard from 'components/pages/leaderboard/ProposalCard';

const Wrapper = styled.div`
  margin-bottom: 30px;
`;

const EmptyListStyled = styled(EmptyList)`
  border-radius: 6px;

  ${up.desktop} {
    height: 217px;
  }
`;

const PARAMS_TYPES = {
  [ProposalsSubTab.ALL]: ['all'],
  [ProposalsSubTab.BAN]: ['banPost'],
  [ProposalsSubTab.USERS]: ['banUser', 'unbanUser'],
  [ProposalsSubTab.UPDATES]: ['setInfo'],
};

@withTranslation()
export default class Proposals extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    subSection: PropTypes.string,
    fetchLeaderProposals: PropTypes.func.isRequired,
  };

  static defaultProps = {
    communityId: undefined,
    subSection: 'all',
  };

  componentDidMount() {
    const { communityId } = this.props;

    if (communityId) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    const { communityId, subSection } = this.props;

    if (communityId !== prevProps.communityId || subSection !== prevProps.subSection) {
      this.fetchData();
    }
  }

  onNeedLoadMore = () => {
    this.fetchData(true);
  };

  async fetchData(isPaging) {
    const { communityId, order, subSection, fetchLeaderProposals } = this.props;

    const params = {
      communityIds: [communityId],
      types: PARAMS_TYPES[subSection],
    };

    if (isPaging) {
      params.offset = order.length;
    }

    try {
      await fetchLeaderProposals(params);
    } catch (err) {
      captureException(err, 'Proposals fetching failed:');
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
    const { communityId, order, isLoading, isEnd, t } = this.props;

    if (!order.length && isLoading) {
      return <PageLoader isStatic />;
    }

    return (
      <Wrapper>
        <InfinityScrollHelper
          disabled={isLoading || isEnd || !communityId}
          onNeedLoadMore={this.onNeedLoadMore}
        >
          {this.renderItems()}
        </InfinityScrollHelper>
        {isLoading ? <PaginationLoader /> : null}
        {!isLoading && isEnd && order.length === 0 ? (
          <EmptyListStyled
            noIcon
            headerText={t('components.leaderboard.proposals.no_found')}
            subText={t('components.leaderboard.proposals.no_found_desc')}
          />
        ) : null}
      </Wrapper>
    );
  }
}
