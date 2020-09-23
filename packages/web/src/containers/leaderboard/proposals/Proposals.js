import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaginationLoader, up } from '@commun/ui';

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

@withTranslation()
export default class Proposals extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    fetchLeaderProposals: PropTypes.func.isRequired,
  };

  static defaultProps = {
    communityId: undefined,
  };

  componentDidMount() {
    const { communityId } = this.props;

    if (communityId) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    const { communityId } = this.props;

    if (communityId !== prevProps.communityId) {
      this.fetchData();
    }
  }

  onNeedLoadMore = () => {
    this.fetchData(true);
  };

  async fetchData(isPaging) {
    const { communityId, order, fetchLeaderProposals } = this.props;

    const params = {
      communityIds: [communityId],
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
            monkey
            headerText={t('components.leaderboard.proposals.no_found')}
            subText={t('components.leaderboard.proposals.no_found_desc')}
          />
        ) : null}
      </Wrapper>
    );
  }
}
