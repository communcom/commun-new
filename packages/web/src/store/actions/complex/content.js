/* eslint-disable no-param-reassign,arrow-body-style */

import { create, update, remove, report as communReport } from 'store/actions/commun/publish';
import { handleNoBalance } from 'store/actions/commun';
import { displaySuccess, displayError } from 'utils/toastsMessages';

export const createPost = ({ communityId, permlink, title, body }) => {
  const data = {
    commun_code: communityId,
    message_id: {
      permlink,
    },
    header: title,
    body,
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

export function deleteComment({ communityId, contentId }, contentIds) {
  const data = {
    commun_code: communityId,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
  };

  return remove(data, contentIds);
}

export const report = contentId => async () => {
  // eslint-disable-next-line no-alert
  const reason = window.prompt('Report reason:');

  if (!reason || !reason.trim()) {
    return;
  }

  try {
    await communReport(contentId, reason.trim());
    displaySuccess('Report successfully sent');
  } catch (err) {
    displayError(err);
  }
};
