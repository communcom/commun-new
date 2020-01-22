import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Loader } from '@commun/ui';
import { contentIdType, extendedPostType } from 'types/common';
import { FEED_COMMENTS_FETCH_LIMIT, SORT_BY_OLDEST } from 'shared/constants';
import Avatar from 'components/common/Avatar';
import CommentForm from 'components/common/CommentForm';

import CommentsList from '../CommentsList';
import Filter from '../CommentsBlock/Filter';

const Wrapper = styled.section`
  padding: 0 15px 15px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0 0;
`;

const AvatarStyled = styled(Avatar)`
  align-self: flex-start;
`;

const CommentFormStyled = styled(CommentForm)`
  margin-left: 16px;
`;

const AllCommentsButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  margin-top: 10px;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.blue};
`;

const LoaderStyled = styled(Loader)`
  color: ${({ theme }) => theme.colors.blue};
`;

const FilterStyled = styled(Filter)`
  max-width: 100px;
  margin-bottom: 5px;
`;

export default function CommentsBlockFeed({
  contentId,
  loggedUserId,
  post,
  order,
  orderNew,
  isLoading,
  isAllowLoadMore,
  fetchPostComments,
}) {
  const [filterSortBy, setCommentsFilter] = useState(SORT_BY_OLDEST);

  useEffect(() => {
    if (!order.length && !orderNew.length && isAllowLoadMore) {
      try {
        fetchPostComments({
          contentId,
          sortBy: filterSortBy,
          limit: FEED_COMMENTS_FETCH_LIMIT,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      //   }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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
  }, [filterSortBy, contentId, fetchPostComments]);

  function checkLoadMore() {
    if (!isAllowLoadMore) {
      return;
    }

    fetchPostComments({
      contentId,
      sortBy: filterSortBy,
      offset: order.length,
      resolveNestedComments: true,
    });
  }

  function renderForm() {
    if (!loggedUserId) {
      return null;
    }

    return (
      <InputWrapper>
        <AvatarStyled userId={loggedUserId} useLink />
        <CommentFormStyled inPost parentPostId={contentId} />
      </InputWrapper>
    );
  }

  const commentsCount = post?.stats?.commentsCount;

  return (
    <Wrapper>
      {commentsCount ? (
        <FilterStyled filterSortBy={filterSortBy} setCommentsFilter={setCommentsFilter} />
      ) : null}
      <Body>
        <CommentsList order={order} isLoading={isLoading} />
        <CommentsList order={orderNew} />
        {isLoading ? <LoaderStyled /> : null}
      </Body>
      {commentsCount > FEED_COMMENTS_FETCH_LIMIT && isAllowLoadMore ? (
        <AllCommentsButton onClick={checkLoadMore}>Show more comments</AllCommentsButton>
      ) : null}
      {renderForm()}
    </Wrapper>
  );
}

CommentsBlockFeed.propTypes = {
  contentId: contentIdType.isRequired,
  loggedUserId: PropTypes.string,
  post: extendedPostType,
  order: PropTypes.arrayOf(PropTypes.string).isRequired,
  orderNew: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isAllowLoadMore: PropTypes.bool.isRequired,

  fetchPostComments: PropTypes.func.isRequired,
};

CommentsBlockFeed.defaultProps = {
  loggedUserId: null,
  post: null,
};
