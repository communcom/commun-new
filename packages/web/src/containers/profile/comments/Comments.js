/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Card, up } from '@commun/ui';
import { fetchUserComments } from 'store/actions/gate/comments';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import EmptyList from 'components/common/EmptyList';
import CommentCard from './CommentCard';

const Wrapper = styled(Card)`
  margin-bottom: 20px;
  background-color: transparent;

  ${is('isEmpty')`
    background-color: #fff;

    ${up.desktop} {
      padding-top: 20px;
    }
  `};
`;

export default class ProfileComments extends PureComponent {
  static propTypes = {
    filterSortBy: PropTypes.string.isRequired,
    totalCommentsCount: PropTypes.number.isRequired,
    queryParams: PropTypes.shape({}).isRequired,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,

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
    const { isAllowLoadMore, queryParams, fetchUserComments, order } = this.props;

    if (!isAllowLoadMore) {
      return;
    }
    try {
      fetchUserComments({
        ...queryParams,
        offset: order.length,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  renderEmpty() {
    const { isOwner } = this.props;

    if (isOwner) {
      return <EmptyList headerText="No comments" subText="You haven't made any comments yet" />;
    }

    return <EmptyList headerText="No comments" />;
  }

  renderComments() {
    const { order } = this.props;

    return order.map(id => <CommentCard key={id} commentId={id} />);
  }

  render() {
    const { totalCommentsCount, isAllowLoadMore } = this.props;

    if (!totalCommentsCount) {
      return <Wrapper isEmpty>{this.renderEmpty()}</Wrapper>;
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
