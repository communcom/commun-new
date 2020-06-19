/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Card, up } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { fetchUserComments } from 'store/actions/gate/comments';

import { CommentCard } from 'components/comment';
import EmptyList from 'components/common/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';

const Wrapper = styled(Card)`
  margin-bottom: 20px;
  background-color: transparent;

  ${is('isEmpty')`
    background-color: ${({ theme }) => theme.colors.white};

    ${up.desktop} {
      padding-top: 20px;
    }
  `};
`;

@withTranslation()
export default class Comments extends PureComponent {
  static propTypes = {
    filterSortBy: PropTypes.string,
    totalCommentsCount: PropTypes.number.isRequired,
    queryParams: PropTypes.shape({}).isRequired,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    nextOffset: PropTypes.number.isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,

    fetchUserComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    filterSortBy: undefined,
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
    const { isAllowLoadMore, queryParams, fetchUserComments, nextOffset } = this.props;

    if (!isAllowLoadMore) {
      return;
    }

    try {
      fetchUserComments({
        ...queryParams,
        offset: nextOffset,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  renderEmpty() {
    const { isOwner, t } = this.props;

    if (isOwner) {
      return (
        <EmptyList
          headerText={t('components.profile.comments.empty')}
          subText={t('components.profile.comments.empty-desc')}
        />
      );
    }

    return <EmptyList headerText={t('components.profile.comments.empty')} />;
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
