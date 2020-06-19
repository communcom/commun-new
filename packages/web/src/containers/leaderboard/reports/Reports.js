import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaginationLoader, up } from '@commun/ui';

import { withTranslation } from 'shared/i18n';

import CommentCard from 'components/comment/CommentCard';
import EmptyList from 'components/common/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import LazyLoad from 'components/common/LazyLoad';
import PageLoader from 'components/common/PageLoader';
import PostCard from 'components/common/PostCard';

const Wrapper = styled.div``;

const EmptyListStyled = styled(EmptyList)`
  border-radius: 6px;

  ${up.desktop} {
    height: 217px;
  }
`;

const PostCardStyled = styled(PostCard)`
  ${up.tablet} {
    border-radius: 10px 10px 0 0;
  }
`;

@withTranslation()
export default class Reports extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    selectedCommunities: PropTypes.arrayOf(PropTypes.string),
    isComments: PropTypes.bool,

    fetchReportsList: PropTypes.func.isRequired,
    compareSelectedCommunities: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedCommunities: undefined,
    isComments: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { selectedCommunities, compareSelectedCommunities, isComments } = this.props;

    if (
      !compareSelectedCommunities(prevProps.selectedCommunities, selectedCommunities) ||
      isComments !== prevProps.isComments
    ) {
      this.fetchData();
    }
  }

  onNeedLoadMore = () => {
    this.fetchData(true);
  };

  async fetchData(isPaging) {
    const { order, selectedCommunities, fetchReportsList, isComments } = this.props;

    if (!selectedCommunities) {
      return;
    }

    const params = {
      communityIds: selectedCommunities,
      contentType: isComments ? 'comment' : 'post',
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
    const { order, isComments } = this.props;

    if (isComments) {
      return order.map(reportId => (
        <LazyLoad key={reportId} height={402} offset={300}>
          <CommentCard commentId={reportId} isShowReports />
        </LazyLoad>
      ));
    }

    return order.map(reportId => (
      <LazyLoad key={reportId} height={402} offset={300}>
        <PostCardStyled postId={reportId} isShowReports />
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
            headerText={t('components.leaderboard.reports.no_found')}
            subText={t('components.leaderboard.reports.no_found_desc')}
          />
        ) : null}
      </Wrapper>
    );
  }
}
