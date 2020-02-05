import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { extendedPostType, contentIdType } from 'types';

import PostCardBody from 'components/common/PostCard/PostCardBody';

function BanPost({ post, contentId, fetchPost, openPost }) {
  useEffect(() => {
    async function fetchPostIfNeed() {
      if (!post && contentId) {
        await fetchPost(contentId, true);
      }
    }

    fetchPostIfNeed();
  }, [post, contentId, fetchPost]);

  function onOpenPost(e) {
    if (!post) {
      return;
    }

    if (e && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }

    openPost(contentId);
  }

  if (!post) {
    return null;
  }

  return <PostCardBody post={post} onPostClick={onOpenPost} />;
}

BanPost.propTypes = {
  post: extendedPostType,
  contentId: contentIdType,

  fetchPost: PropTypes.func.isRequired,
  openPost: PropTypes.func.isRequired,
};

BanPost.defaultProps = {
  post: null,
  contentId: null,
};

export default BanPost;
