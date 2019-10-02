/* eslint-disable no-param-reassign,arrow-body-style */

import { createmssg, updatemssg, deletemssg } from 'store/actions/commun/publish';

export function createPost({ permlink, title, body }) {
  const data = {
    message_id: {
      permlink,
    },
    headermssg: title,
    bodymssg: body,
  };

  return createmssg(data);
}

export function updatePost({ contentId, title, body }) {
  const data = {
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    headermssg: title,
    bodymssg: body,
  };

  return updatemssg(data);
}

export function createComment({ parentId, permlink, body }) {
  const data = {
    message_id: {
      permlink,
    },
    parent_id: {
      author: parentId.userId,
      permlink: parentId.permlink,
    },
    headermssg: '',
    bodymssg: body,
  };

  return createmssg(data);
}

export function updateComment({ contentId, body }) {
  const data = {
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    headermssg: '',
    bodymssg: body,
  };

  return updatemssg(data);
}

export function deleteComment(contentId, postContentId) {
  const data = {
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
  };

  return deletemssg(data, postContentId);
}
