import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import is from 'styled-is';

import { HEADER_HEIGHT } from 'components/Header/constants';
import { Loader, TabHeader } from '@commun/ui';
import { Icon } from '@commun/icons';
import { contentIdType, extendedPostType } from 'types/common';
import Avatar from 'components/Avatar';
import CommentForm from 'components/CommentForm';
import InfinityScrollHelper from 'components/InfinityScrollHelper';
import { setScrollRestoration, getScrollContainer } from 'utils/ui';
import { PostLink } from 'components/links';

import Filter from './Filter';
import CommentsList from '../CommentList';

const Wrapper = styled.section`
  padding-top: 20px;

  ${is('inFeed')`
    padding: 0 15px 15px;
  `}
`;

const Header = styled.div`
  padding: 16px 0;

  ${up('desktop')} {
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
  margin: 35px 0;

  ${is('inFeed')`
    margin: 15px 0 0;
  `};
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

const AllCommentsLink = styled.a`
  display: flex;
  margin-top: 10px;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

export default class CommentsBlock extends PureComponent {
  static propTypes = {
    contentId: contentIdType.isRequired,
    loggedUserId: PropTypes.string,
    post: extendedPostType.isRequired,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    setCommentsFilter: PropTypes.func.isRequired,
    filterSortBy: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    sequenceKey: PropTypes.string,
    inFeed: PropTypes.bool,
    fetchPostComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
    sequenceKey: null,
    inFeed: false,
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
      isAllowLoadMore,
      contentId,
      sequenceKey,
      fetchPostComments,
      filterSortBy: sortBy,
    } = this.props;

    if (!isAllowLoadMore) {
      return;
    }

    fetchPostComments({
      contentId,
      sequenceKey,
      sortBy,
      limit: 3,
    });
  };

  renderForm() {
    const { loggedUserId, contentId, inFeed } = this.props;

    if (!loggedUserId) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return (
      <InputWrapper inFeed={inFeed}>
        <Avatar userId={loggedUserId} useLink />
        <CommentFormStyled inPost contentId={contentId} />
        <IconPhoto />
      </InputWrapper>
    );
  }

  render() {
    const {
      order,
      post,
      filterSortBy,
      isLoading,
      setCommentsFilter,
      isAllowLoadMore,
      inFeed,
    } = this.props;

    return (
      <Wrapper ref={this.wrapperRef} inFeed={inFeed}>
        <Header>
          <HeaderTop>
            {!inFeed ? <TabHeader title="Comments" quantity={post.stats.commentsCount} /> : null}
            <Filter filterSortBy={filterSortBy} setCommentsFilter={setCommentsFilter} />
          </HeaderTop>
        </Header>
        {!inFeed ? this.renderForm() : null}
        <Body>
          <InfinityScrollHelper
            ref={this.commentsListRef}
            disabled={!isAllowLoadMore}
            onNeedLoadMore={this.checkLoadMore}
          >
            <CommentsList order={order} isLoading={isLoading} />
          </InfinityScrollHelper>
          {order.length && isLoading ? <Loader /> : null}
        </Body>
        {inFeed ? (
          <PostLink post={post} hash="comments">
            <AllCommentsLink>Show all comments</AllCommentsLink>
          </PostLink>
        ) : null}
        {inFeed ? this.renderForm() : null}
      </Wrapper>
    );
  }
}
