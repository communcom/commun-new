import React, { PureComponent, createRef } from 'react';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import PropTypes from 'prop-types';

import { HEADER_HEIGHT } from 'components/Header/constants';
import { Loader, TabHeader } from '@commun/ui';
import { contentIdType } from 'types/common';
import Avatar from 'components/Avatar';
import CommentForm from 'components/CommentForm';
import InfinityScrollHelper from 'components/InfinityScrollHelper';
import { setScrollRestoration, getScrollContainer } from 'utils/ui';

import Filter from './Filter';
import CommentsList from '../CommentList';

const Wrapper = styled.section``;

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
  margin-top: 24px;
`;

const CommentFormStyled = styled(CommentForm)`
  margin-left: 16px;
`;

export default class CommentsBlock extends PureComponent {
  static propTypes = {
    contentId: contentIdType.isRequired,
    loggedUserId: PropTypes.string,
    totalCommentsCount: PropTypes.number,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    setCommentsFilter: PropTypes.func.isRequired,
    filterSortBy: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    sequenceKey: PropTypes.string,
    fetchPostComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
    totalCommentsCount: null,
    sequenceKey: null,
  };

  wrapperRef = createRef();

  commentsListRef = createRef();

  async componentDidMount() {
    const { contentId, filterSortBy: sortBy, fetchPostComments } = this.props;

    setScrollRestoration('manual');

    try {
      await fetchPostComments({
        contentId,
        sortBy,
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
    const { contentId, filterSortBy: sortBy, fetchPostComments } = this.props;

    if (prevProps.filterSortBy !== sortBy) {
      try {
        fetchPostComments({
          contentId,
          sortBy,
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
    });
  };

  render() {
    const {
      loggedUserId,
      order,
      totalCommentsCount,
      filterSortBy,
      isLoading,
      setCommentsFilter,
      contentId,
      isAllowLoadMore,
    } = this.props;

    return (
      <Wrapper ref={this.wrapperRef}>
        <Header>
          <HeaderTop>
            <TabHeader title="Comments" quantity={totalCommentsCount} />
            <Filter filterSortBy={filterSortBy} setCommentsFilter={setCommentsFilter} />
          </HeaderTop>
          {loggedUserId && (
            <InputWrapper>
              <Avatar userId={loggedUserId} useLink />
              <CommentFormStyled inPost contentId={contentId} />
            </InputWrapper>
          )}
        </Header>
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
      </Wrapper>
    );
  }
}
