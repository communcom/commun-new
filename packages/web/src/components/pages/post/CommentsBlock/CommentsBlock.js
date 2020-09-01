import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Loader, up } from '@commun/ui';

import { contentIdType, extendedPostType } from 'types/common';
import { withTranslation } from 'shared/i18n';
import { captureException } from 'utils/errors';
import { getScrollContainer, setScrollRestoration } from 'utils/ui';

import Avatar from 'components/common/Avatar';
import CommentForm from 'components/common/CommentForm';
import { HEADER_HEIGHT } from 'components/common/Header';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import CommentsList from '../CommentsList';
import Filter from './Filter';

const Wrapper = styled.section``;

const Header = styled.header`
  padding: 0;
`;

const Title = styled.h3`
  font-weight: bold;
  font-size: 21px;
  line-height: 29px;
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
  margin: 20px 0;

  ${up.desktop} {
    margin: 35px 0;
  }
`;

const AvatarStyled = styled(Avatar)`
  width: 35px;
  height: 35px;
  align-self: flex-start;
`;

const CommentFormStyled = styled(CommentForm)`
  margin-left: 10px;
`;

const Empty = styled.div``;

const BigLoader = styled(Loader)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  & > svg {
    width: 48px;
    height: 48px;
  }
`;

@withTranslation()
export default class CommentsBlock extends PureComponent {
  static propTypes = {
    post: extendedPostType.isRequired,
    contentId: contentIdType.isRequired,
    loggedUserId: PropTypes.string,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    filterSortBy: PropTypes.string.isRequired,
    showLoader: PropTypes.bool.isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    commentId: PropTypes.string,

    setCommentsFilter: PropTypes.func.isRequired,
    fetchPostComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
    commentId: null,
  };

  wrapperRef = createRef();

  commentsListRef = createRef();

  async componentDidMount() {
    const { contentId, filterSortBy, fetchPostComments, order, commentId } = this.props;
    setScrollRestoration('manual');

    try {
      await fetchPostComments({
        contentId,
        sortBy: filterSortBy,
        resolveNestedComments: true,
      });
    } catch (err) {
      captureException(err);
    }

    this.scrollToTimeout = setTimeout(this.scrollToCommentsIfNeeded, 100);

    if (order.includes(commentId)) {
      const commentEl = document.getElementById(commentId);

      if (commentEl) {
        this.initialScrollToComment = setTimeout(() => this.scrollToComment(commentEl, true), 100);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { order } = this.props;

    if (nextProps.order.length !== order.length) {
      clearTimeout(this.loadMoreCheckTimeout);

      this.loadMoreCheckTimeout = setTimeout(() => {
        if (this.commentsListRef.current) {
          this.commentsListRef.current.checkLoadMore();
        }
      }, 1000);
    }
  }

  componentDidUpdate(prevProps) {
    const { contentId, filterSortBy, fetchPostComments, order, commentId } = this.props;
    const { hash } = window.location;

    if (prevProps.filterSortBy !== filterSortBy) {
      if (hash) {
        window.location.hash = '';
      }

      try {
        fetchPostComments({
          contentId,
          sortBy: filterSortBy,
          resolveNestedComments: true,
        });
      } catch (err) {
        captureException(err);
      }
    }

    if (
      order.length &&
      order.length < 50 &&
      order !== prevProps.order &&
      commentId &&
      commentId !== 'comments' &&
      !order.includes(commentId)
    ) {
      this.checkLoadMore();
    }

    if (order.length && order.length >= 50 && commentId && !order.includes(commentId)) {
      if (hash && hash !== '#comments') {
        window.location.hash = '#comments';
        this.scrollToTimeout = setTimeout(this.scrollToCommentsIfNeeded, 100);
      }
    }

    if (
      order.length &&
      order !== prevProps.order &&
      !prevProps.order.includes(commentId) &&
      order.includes(commentId)
    ) {
      const commentEl = document.getElementById(commentId);

      if (commentEl) {
        this.initialScrollToComment = setTimeout(() => this.scrollToComment(commentEl, true), 100);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollToTimeout);
    clearTimeout(this.loadMoreCheckTimeout);
    clearTimeout(this.scrollToCommentTimeout);
    clearInterval(this.initialScrollToComment);

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

  scrollToComment = (el, withCorrection) => {
    const { hash } = window.location;

    if (!hash || hash === '#comments') {
      return;
    }

    const scrollContainer = getScrollContainer(this.wrapperRef.current);
    const offsetFromDocTop =
      scrollContainer.scrollTop + el.getBoundingClientRect().top - HEADER_HEIGHT;
    scrollContainer.scrollTo({
      top: offsetFromDocTop,
      behavior: 'smooth',
    });

    // встроенный контент при подгрузке увеличивает высоту страницы, из-за этого нужен дополнительный подскролл, когда все до нужного коммента загружено
    if (withCorrection) {
      this.scrollToCommentTimeout = setTimeout(() => {
        this.scrollToComment(el, false);
      }, 300);
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

    // eslint-disable-next-line consistent-return
    return (
      <InputWrapper>
        <AvatarStyled userId={loggedUserId} useLink />
        <CommentFormStyled inPost parentPostId={contentId} />
      </InputWrapper>
    );
  }

  render() {
    const {
      post,
      order,
      filterSortBy,
      showLoader,
      setCommentsFilter,
      isAllowLoadMore,
      t,
    } = this.props;

    const { commentsCount } = post.stats;

    return (
      <Wrapper ref={this.wrapperRef}>
        <Header>
          <HeaderTop>
            <Title>{t('components.comments_block.title')}</Title>
            {commentsCount !== 0 ? (
              <Filter filterSortBy={filterSortBy} setCommentsFilter={setCommentsFilter} />
            ) : null}
          </HeaderTop>
        </Header>
        {this.renderForm()}
        <Body>
          <InfinityScrollHelper
            ref={this.commentsListRef}
            disabled={!isAllowLoadMore}
            onNeedLoadMore={this.checkLoadMore}
          >
            {order ? <CommentsList order={order} /> : null}
            {order.length === 0 && !showLoader ? (
              <Empty>{t('components.comments_block.empty')}</Empty>
            ) : null}
            {showLoader && order.length ? <Loader /> : null}
          </InfinityScrollHelper>
          {showLoader && !order.length ? <BigLoader /> : null}
        </Body>
      </Wrapper>
    );
  }
}
