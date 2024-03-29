/* eslint-disable no-param-reassign,arrow-body-style */

import { i18n } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { handleNoBalance } from 'store/actions/commun/point';
import {
  create,
  removeComment,
  removePost,
  report as communReport,
  update,
} from 'store/actions/commun/publish';

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

export function updatePost({ communityId, contentId, title, body, tags }) {
  const data = {
    commun_code: communityId,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    header: title,
    body,
    tags,
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
  const { communityId, contentId } = comment;

  const data = {
    commun_code: communityId,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
  };

  return removeComment(data, { commentId: comment.id });
}

export function deletePost(post) {
  const { communityId, contentId } = post;

  const data = {
    commun_code: communityId,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
  };

  return removePost(data, { postId: post.id });
}

export const report = (contentId, reasons) => async dispatch => {
  if (!reasons || !reasons.trim()) {
    return;
  }

  try {
    await dispatch(communReport(contentId, reasons.trim()));
    displaySuccess(i18n.t('toastsMessages.report.sent'));
  } catch (err) {
    displayError(err);
  }
};
