import React, { memo, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectFeatureToggles } from '@flopflip/react-redux';

import { up } from '@commun/ui';
import { extendedPostType } from 'types/common';
import { FEATURE_POST_FEED_COMMENTS } from 'shared/featureFlags';

import CommentsBlockFeed from 'components/post/CommentsBlockFeed';
import PostViewRecorder from 'components/common/PostViewRecorder';
import LazyLoad from 'components/common/LazyLoad';
import EntityCardReports from 'components/common/EntityCardReports';

import PostCardHeader from './PostCardHeader';
import PostCardBody from './PostCardBody';
import PostCardFooter from './PostCardFooter';

const Wrapper = styled.article`
  margin-bottom: 10px;
  background-color: #fff;

  ${up.tablet} {
    border-radius: 6px;
  }
`;

function PostCard({
  post,
  isShowReports,
  openPost,
  openPostEdit,
  deletePost,
  className,
  featureToggles,
}) {
  const postRef = useRef();
  const [isRecorded, setIsRecorded] = useState(post.isViewed);
  const [isNsfwAccepted, setIsNsfwAccepted] = useState(false);

  const onNsfwAccepted = useCallback(() => setIsNsfwAccepted(true), []);

  const onClick = useCallback(
    e => {
      if (e && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
      }

      openPost(post.contentId);
    },
    [post, openPost]
  );

  const onEditClick = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }

      openPostEdit(post.contentId);
    },
    [post, openPostEdit]
  );

  const onDeleteClick = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }

      deletePost(post);
    },
    [post, deletePost]
  );

  const onPostViewRecorded = useCallback(
    value => {
      setIsRecorded(value);
    },
    [setIsRecorded]
  );

  const isShowComments =
    featureToggles[FEATURE_POST_FEED_COMMENTS] && Boolean(post.stats.commentsCount);

  return (
    <>
      {!isRecorded && !isShowReports ? (
        <PostViewRecorder
          viewportRef={postRef}
          contentId={post.contentId}
          onChange={onPostViewRecorded}
        />
      ) : null}
      <Wrapper ref={postRef} className={className}>
        <PostCardHeader
          post={post}
          isHideMenu={isShowReports}
          isReport={isShowReports}
          disableLink={Boolean(post.isNsfw && !isNsfwAccepted)}
          onPostClick={onClick}
          onPostEditClick={onEditClick}
          onPostDeleteClick={onDeleteClick}
        />
        <PostCardBody
          post={post}
          onPostClick={onClick}
          isNsfwAccepted={isNsfwAccepted}
          onNsfwAccepted={onNsfwAccepted}
        />
        <PostCardFooter post={post} />
        {!isShowReports && isShowComments ? (
          <LazyLoad height={200} offset={300}>
            <CommentsBlockFeed contentId={post.contentId} />
          </LazyLoad>
        ) : null}
        {isShowReports ? <EntityCardReports entity={post} /> : null}
      </Wrapper>
    </>
  );
}

PostCard.propTypes = {
  post: extendedPostType.isRequired,
  isShowReports: PropTypes.bool,
  openPost: PropTypes.func.isRequired,
  openPostEdit: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  featureToggles: PropTypes.object.isRequired,
};

PostCard.defaultProps = {
  isShowReports: false,
};

export default memo(injectFeatureToggles([FEATURE_POST_FEED_COMMENTS])(PostCard));
