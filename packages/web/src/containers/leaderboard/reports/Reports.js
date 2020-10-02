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
    communityId: PropTypes.string,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    isComments: PropTypes.bool,

    fetchReportsList: PropTypes.func.isRequired,
  };

  static defaultProps = {
    communityId: undefined,
    isComments: false,
  };

  componentDidMount() {
    const { communityId } = this.props;

    if (communityId) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    const { communityId, isComments } = this.props;

    if (communityId !== prevProps.communityId || isComments !== prevProps.isComments) {
      this.fetchData();
    }
  }

  onNeedLoadMore = () => {
    this.fetchData(true);
  };

  async fetchData(isPaging) {
    const { communityId, order, fetchReportsList, isComments } = this.props;

    const params = {
      communityIds: [communityId],
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
            headerText={t('components.leaderboard.reports.no_found')}
            subText={t('components.leaderboard.reports.no_found_desc')}
          />
        ) : null}
      </Wrapper>
    );
  }
}
