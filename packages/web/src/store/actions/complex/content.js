/* eslint-disable no-param-reassign,arrow-body-style */

import {
  create,
  update,
  removeComment,
  report as communReport,
} from 'store/actions/commun/publish';
import { handleNoBalance } from 'store/actions/commun';
import { displaySuccess, displayError } from 'utils/toastsMessages';

export const createPost = ({ communityId, permlink, title, body, tags }) => {
  const data = {
    commun_code: communityId,
    message_id: {
      permlink,
    },
    header: title,
    body,
    tags,
  };

  return handleNoBalance(communityId, create(data));
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

  return update(data);
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

  return handleNoBalance(communityId, create(data));
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

  return update(data);
}

export function deleteComment(comment) {
  const { community, contentId } = comment;

  const communityId = typeof community === 'string' ? community : community.communityId;

  const data = {
    commun_code: communityId,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
  };

  return removeComment(data, { commentId: comment.id });
}

export const report = (contentId, reasons) => async dispatch => {
  if (!reasons || !reasons.trim()) {
    return;
  }

  try {
    await dispatch(communReport(contentId, reasons.trim()));
    displaySuccess('Report successfully sent');
  } catch (err) {
    displayError(err);
  }
};
