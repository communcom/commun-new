/* eslint-disable no-param-reassign,arrow-body-style */

import { createmssg, updatemssg, deletemssg } from 'store/actions/commun/publish';
import { handleNoBalance } from 'store/actions/commun';

export const createPost = ({ communityId, permlink, title, body }) => {
  const data = {
    commun_code: communityId,
    message_id: {
      permlink,
    },
    header: title,
    body,
  };

  return handleNoBalance(communityId, createmssg(data));
};

export function updatePost({ communityId, contentId, title, body }) {
  const data = {
    commun_code: communityId,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    header: title,
    body,
  };

  return updatemssg(data);
}

export function createComment({ communityId, parentId, permlink, body }) {
  const data = {
    commun_code: communityId,
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

  return handleNoBalance(communityId, createmssg(data));
}

export function updateComment({ communityId, contentId, body }) {
  const data = {
    commun_code: communityId,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    header: '',
    body,
  };

  return updatemssg(data);
}

export function deleteComment({ communityId, contentId }, postContentId) {
  const data = {
    commun_code: communityId,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
  };

  return deletemssg(data, postContentId);
}
