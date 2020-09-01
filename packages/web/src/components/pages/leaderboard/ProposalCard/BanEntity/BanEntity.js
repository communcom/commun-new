import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { contentIdType, extendedCommentType, extendedPostType } from 'types';
import { captureException } from 'utils/errors';

import Attachments from 'components/comment/Attachments';
import CommentBody from 'components/comment/CommentBody';
import PostCardBody from 'components/common/PostCard/PostCardBody';

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 10px 15px;
  overflow: hidden;
  cursor: pointer;
`;

function BanEntity({
  entity,
  contentId,
  isNsfwShow,
  isComment,
  fetchPost,
  fetchComment,
  openPost,
}) {
  const [isFetched, setIsFetched] = useState(false);
  const [isNsfwAccepted, setIsNsfwAccepted] = useState(isNsfwShow);

  const onNsfwAccepted = useCallback(() => setIsNsfwAccepted(true), []);

  useEffect(() => {
    async function fetchEntityIfNeed() {
      if (!entity && contentId && !isFetched) {
        try {
          if (isComment) {
            await fetchComment({ contentId });
          } else {
            await fetchPost(contentId, true);
          }
        } catch (err) {
          captureException(err);
        } finally {
          setIsFetched(true);
        }
      }
    }

    fetchEntityIfNeed();
  }, [entity, contentId, fetchPost, fetchComment, isComment, isFetched]);

  function onOpenPost(e) {
    if (!entity) {
      return;
    }

    if (e && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }

    if (isComment) {
      openPost(entity.parents.post, entity.id);
      return;
    }

    openPost(contentId);
  }

  if (!entity) {
    return null;
  }

  if (isComment) {
    return (
      <Content onClick={onOpenPost}>
        <CommentBody comment={entity} />
        <Attachments comment={entity} />
      </Content>
    );
  }

  return (
    <PostCardBody
      post={entity}
      isNsfwAccepted={isNsfwAccepted}
      onNsfwAccepted={onNsfwAccepted}
      onPostClick={onOpenPost}
    />
  );
}

BanEntity.propTypes = {
  entity: PropTypes.oneOfType([extendedPostType, extendedCommentType]),
  contentId: contentIdType,
  isComment: PropTypes.bool,
  isNsfwShow: PropTypes.bool,

  fetchPost: PropTypes.func.isRequired,
  fetchComment: PropTypes.func.isRequired,
  openPost: PropTypes.func.isRequired,
};

BanEntity.defaultProps = {
  entity: null,
  contentId: null,
  isComment: false,
  isNsfwShow: false,
};

export default memo(BanEntity);
