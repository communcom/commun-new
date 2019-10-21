/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TabHeader, up } from '@commun/ui';
import EmptyContentHolder, { NO_COMMENTS } from 'components/common/EmptyContentHolder';
import { fetchUserComments } from 'store/actions/gate/comments';
import { Filter } from 'components/post/CommentsBlock';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import CommentCard from './CommentCard';

const Wrapper = styled.section`
  margin-bottom: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 0 16px;
  background-color: #fff;
  overflow: hidden;
`;

const CustomFilter = styled(Filter)`
  ${up.tablet} {
    margin-right: -12px;
  }
`;

export default class ProfileComments extends PureComponent {
  static async getInitialProps({ store, query }) {
    const queryParams = { userId: query.userId };

    await store.dispatch(fetchUserComments(queryParams));

    return {
      queryParams,
    };
  }

  static propTypes = {
    filterSortBy: PropTypes.string.isRequired,
    totalCommentsCount: PropTypes.number.isRequired,
    queryParams: PropTypes.shape({}).isRequired,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    sequenceKey: PropTypes.string.isRequired,
    setCommentsFilter: PropTypes.func.isRequired,
    fetchUserComments: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { filterSortBy: sortBy, queryParams, fetchUserComments } = this.props;

    if (prevProps.filterSortBy !== sortBy) {
      try {
        fetchUserComments({
          ...queryParams,
          sortBy,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  }

  checkLoadMore = () => {
    const { isAllowLoadMore, queryParams, sequenceKey, fetchUserComments } = this.props;

    if (!isAllowLoadMore) {
      return;
    }
    try {
      fetchUserComments({
        ...queryParams,
        sequenceKey,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  renderComments() {
    const { order } = this.props;

    return order.map(id => <CommentCard key={id} commentId={id} />);
  }

  render() {
    const { totalCommentsCount, filterSortBy, isAllowLoadMore, setCommentsFilter } = this.props;

    if (!totalCommentsCount) {
      return <EmptyContentHolder type={NO_COMMENTS} />;
    }

    return (
      <Wrapper>
        <Header>
          <TabHeader title="Comments" quantity={totalCommentsCount} />
          <CustomFilter filterSortBy={filterSortBy} setCommentsFilter={setCommentsFilter} />
        </Header>
        <InfinityScrollHelper disabled={!isAllowLoadMore} onNeedLoadMore={this.checkLoadMore}>
          {this.renderComments()}
        </InfinityScrollHelper>
      </Wrapper>
    );
  }
}
