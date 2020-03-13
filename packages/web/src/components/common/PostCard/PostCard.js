import React, { memo, useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectFeatureToggles } from '@flopflip/react-redux';

import { up } from '@commun/ui';
import { extendedPostType } from 'types/common';
import { FEATURE_POST_FEED_COMMENTS } from 'shared/featureFlags';
import { FEED_ONBOARDING_TOOLTIP_TYPE, DISABLE_TOOLTIPS_KEY } from 'shared/constants';
import { getFieldValue } from 'utils/localStore';
import { fancyScrollTo } from 'utils/ui';

import CommentsBlockFeed from 'components/post/CommentsBlockFeed';
import PostViewRecorder from 'components/common/PostViewRecorder';
import LazyLoad from 'components/common/LazyLoad';
import EntityCardReports from 'components/common/EntityCardReports';
import FeedOnboardingTooltip from 'components/tooltips/FeedOnboardingTooltip';

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

const NEW_POST_TIME = 300000; // 5 min
const SCROLL_TO_NEW_POST_TIME = 30000; // 30 sec

function PostCard({
  post,
  loggedUserId,
  isShowReports,
  isAllowToShowShareTooltip,
  tooltipType,
  openPost,
  openPostEdit,
  deletePost,
  className,
  featureToggles,
}) {
  const postRef = useRef();

  const [isRecorded, setIsRecorded] = useState(post.isViewed);
  const [isNsfwAccepted, setIsNsfwAccepted] = useState(false);
  const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);
  const [isOnboardingTooltipShowed, setIsOnboardingTooltipShowed] = useState(true);

  const postCreationTime = new Date(post.meta.creationTime);
  const isNeedShowShareTooltip =
    isAllowToShowShareTooltip &&
    post.authorId === loggedUserId &&
    Date.now() - postCreationTime < NEW_POST_TIME;
  const tooltip = isNeedShowShareTooltip ? FEED_ONBOARDING_TOOLTIP_TYPE.SHARE : tooltipType;

  useEffect(() => {
    if (
      isNeedShowShareTooltip &&
      postRef.current &&
      Date.now() - postCreationTime < SCROLL_TO_NEW_POST_TIME
    ) {
      fancyScrollTo(postRef.current);
    }

    setIsTooltipDisabled(tooltip && getFieldValue(DISABLE_TOOLTIPS_KEY, tooltip));
  }, [tooltip, postCreationTime, isNeedShowShareTooltip]);

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

  function renderTooltip(renderAt = 'bottom') {
    if (isShowReports || !tooltip || !isOnboardingTooltipShowed || isTooltipDisabled) {
      return null;
    }

    return (
      <FeedOnboardingTooltip
        tooltipType={tooltip}
        renderAt={renderAt}
        postElement={postRef.current}
        onHide={setIsOnboardingTooltipShowed}
      />
    );
  }

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
      {tooltip === FEED_ONBOARDING_TOOLTIP_TYPE.REWARD ? renderTooltip('top') : null}
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
        <PostCardFooter post={post} tooltipType={!isTooltipDisabled ? tooltip : null} />
        {!isShowReports && isShowComments ? (
          <LazyLoad height={200} offset={300}>
            <CommentsBlockFeed contentId={post.contentId} />
          </LazyLoad>
        ) : null}
        {isShowReports ? <EntityCardReports entity={post} /> : null}
      </Wrapper>
      {tooltip !== FEED_ONBOARDING_TOOLTIP_TYPE.REWARD ? renderTooltip() : null}
    </>
  );
}

PostCard.propTypes = {
  post: extendedPostType.isRequired,
  loggedUserId: PropTypes.string,
  isShowReports: PropTypes.bool,
  isAllowToShowShareTooltip: PropTypes.bool,
  featureToggles: PropTypes.object.isRequired,
  tooltipType: PropTypes.string,

  openPost: PropTypes.func.isRequired,
  openPostEdit: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

PostCard.defaultProps = {
  loggedUserId: null,
  isShowReports: false,
  isAllowToShowShareTooltip: false,
  tooltipType: null,
};

export default memo(injectFeatureToggles([FEATURE_POST_FEED_COMMENTS])(PostCard));
