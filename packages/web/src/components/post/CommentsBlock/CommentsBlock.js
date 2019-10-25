import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { HEADER_HEIGHT } from 'components/common/Header';
import { Loader, TabHeader, up } from '@commun/ui';
import { Icon } from '@commun/icons';
import { contentIdType, extendedPostType } from 'types/common';
import Avatar from 'components/common/Avatar';
import CommentForm from 'components/common/CommentForm';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import { setScrollRestoration, getScrollContainer } from 'utils/ui';

import Filter from './Filter';
import CommentsList from '../CommentList';

const Wrapper = styled.section`
  padding-top: 20px;
`;

const Header = styled.div`
  padding: 16px 0;

  ${up.desktop} {
    padding: 0 0 12px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Body = styled.div``;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 25px 0;

  ${up.desktop} {
    margin: 35px 0;
  }
`;

const CommentFormStyled = styled(CommentForm)`
  margin-left: 16px;
`;

const IconPhoto = styled(Icon).attrs({
  name: 'photo',
})`
  cursor: pointer;
  width: 19px;
  height: 19px;
  margin-left: 8px;
`;

export default class CommentsBlock extends PureComponent {
  static propTypes = {
    contentId: contentIdType.isRequired,
    loggedUserId: PropTypes.string,
    post: extendedPostType.isRequired,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    orderNew: PropTypes.arrayOf(PropTypes.string).isRequired,
    setCommentsFilter: PropTypes.func.isRequired,
    filterSortBy: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    fetchPostComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
  };

  wrapperRef = createRef();

  commentsListRef = createRef();

  async componentDidMount() {
    const { contentId, filterSortBy, fetchPostComments } = this.props;

    setScrollRestoration('manual');

    try {
      await fetchPostComments({
        contentId,
        sortBy: filterSortBy,
        resolveNestedComments: true,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    this.scrollToTimeout = setTimeout(this.scrollToCommentsIfNeeded, 100);
  }

  componentWillReceiveProps(nextProps) {
    const { order } = this.props;

    if (nextProps.order.length !== order.length) {
      this.loadMoreCheckTimeout = setTimeout(() => {
        this.commentsListRef.current.checkLoadMore();
      }, 1000);
    }
  }

  componentDidUpdate(prevProps) {
    const { contentId, filterSortBy, fetchPostComments } = this.props;

    if (prevProps.filterSortBy !== filterSortBy) {
      try {
        fetchPostComments({
          contentId,
          sortBy: filterSortBy,
          resolveNestedComments: true,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollToTimeout);
    clearTimeout(this.loadMoreCheckTimeout);

    setScrollRestoration('auto');
  }

  scrollToCommentsIfNeeded = () => {
    if (window.location.hash === '#comments') {
      const scrollContainer = getScrollContainer(this.wrapperRef.current);

      const offsetFromDocTop =
        scrollContainer.scrollTop +
        this.wrapperRef.current.getBoundingClientRect().top -
        HEADER_HEIGHT;

      scrollContainer.scrollTo({
        top: offsetFromDocTop,
        behavior: 'smooth',
      });
    }
  };

  checkLoadMore = () => {
    const {
      order,
      isAllowLoadMore,
      contentId,
      fetchPostComments,
      filterSortBy: sortBy,
    } = this.props;

    if (!isAllowLoadMore) {
      return;
    }

    fetchPostComments({
      contentId,
      sortBy,
      offset: order.length,
      resolveNestedComments: true,
    });
  };

  renderForm() {
    const { loggedUserId, contentId } = this.props;

    if (!loggedUserId) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return (
      <InputWrapper>
        <Avatar userId={loggedUserId} useLink />
        <CommentFormStyled inPost parentPostId={contentId} />
        <IconPhoto />
      </InputWrapper>
    );
  }

  render() {
    const {
      order,
      orderNew,
      post,
      filterSortBy,
      isLoading,
      setCommentsFilter,
      isAllowLoadMore,
    } = this.props;

    return (
      <Wrapper ref={this.wrapperRef}>
        <Header>
          <HeaderTop>
            <TabHeader title="Comments" quantity={post.stats.commentsCount} />
            <Filter filterSortBy={filterSortBy} setCommentsFilter={setCommentsFilter} />
          </HeaderTop>
        </Header>
        {this.renderForm()}
        <Body>
          <InfinityScrollHelper
            ref={this.commentsListRef}
            disabled={!isAllowLoadMore}
            onNeedLoadMore={this.checkLoadMore}
          >
            <CommentsList order={order} isLoading={isLoading} />
            <CommentsList order={orderNew} isNew />
          </InfinityScrollHelper>
          {order.length && isLoading ? <Loader /> : null}
        </Body>
      </Wrapper>
    );
  }
}
