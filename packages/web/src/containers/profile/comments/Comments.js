/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import EmptyContentHolder, { NO_COMMENTS } from 'components/common/EmptyContentHolder';
import { fetchUserComments } from 'store/actions/gate/comments';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import CommentCard from './CommentCard';

const Wrapper = styled.section`
  margin-bottom: 20px;
`;

export default class ProfileComments extends PureComponent {
  static propTypes = {
    filterSortBy: PropTypes.string.isRequired,
    totalCommentsCount: PropTypes.number.isRequired,
    queryParams: PropTypes.shape({}).isRequired,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    fetchUserComments: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    const queryParams = { userId: parentInitialProps.userId };

    await store.dispatch(fetchUserComments(queryParams));

    return {
      queryParams,
    };
  }

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
    const { isAllowLoadMore, queryParams, fetchUserComments } = this.props;

    if (!isAllowLoadMore) {
      return;
    }
    try {
      fetchUserComments({
        ...queryParams,
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
    const { totalCommentsCount, isAllowLoadMore } = this.props;

    if (!totalCommentsCount) {
      return <EmptyContentHolder type={NO_COMMENTS} />;
    }

    return (
      <Wrapper>
        <InfinityScrollHelper disabled={!isAllowLoadMore} onNeedLoadMore={this.checkLoadMore}>
          {this.renderComments()}
        </InfinityScrollHelper>
      </Wrapper>
    );
  }
}
