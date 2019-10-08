/* eslint-disable no-param-reassign,arrow-body-style */

import { createmssg, updatemssg, deletemssg } from 'store/actions/commun/publish';

export function createPost({ communityCode, permlink, title, body }) {
  const data = {
    commun_code: communityCode,
    message_id: {
      permlink,
    },
    header: title,
    body,
  };

  return createmssg(data);
}

export function updatePost({ communityCode, contentId, title, body }) {
  const data = {
    commun_code: communityCode,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    header: title,
    body,
  };

  return updatemssg(data);
}

export function createComment({ communityCode, parentId, permlink, body }) {
  const data = {
    commun_code: communityCode,
    message_id: {
      permlink,
    },
    parent_id: {
      author: parentId.userId,
      permlink: parentId.permlink,
    },
    header: '',
    body,
  };

  return createmssg(data);
}

export function updateComment({ communityCode, contentId, body }) {
  const data = {
    commun_code: communityCode,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    header: '',
    body,
  };

  return updatemssg(data);
}

export function deleteComment({ communityCode, contentId }, postContentId) {
  const data = {
    commun_code: communityCode,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
  };

  return deletemssg(data, postContentId);
}
