import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  CREATE_POST,
  CREATE_POST_SUCCESS,
  CREATE_POST_ERROR,
  UPDATE_POST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_ERROR,
  DELETE_COMMENT,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_ERROR,
  DELETE_POST,
  DELETE_POST_SUCCESS,
  DELETE_POST_ERROR,
  VOTE_POST,
  VOTE_POST_SUCCESS,
  VOTE_POST_ERROR,
  SEND_REPORT,
  SEND_REPORT_SUCCESS,
  SEND_REPORT_ERROR,
} from 'store/constants/actionTypes';
import { UPVOTE, DOWNVOTE } from 'shared/constants';
import { handleNoBalance } from 'store/actions/commun/point';
import { checkAuth } from 'store/actions/complex/auth';

import { defaults } from 'utils/common';

export const create = data => async dispatch => {
  const userId = await dispatch(checkAuth());

  const fullData = defaults(data, {
    commun_code: '',
    message_id: {
      author: '',
      permlink: '',
    },
    parent_id: {
      author: '',
      permlink: '',
    },
    header: '',
    body: '',
    tags: [],
    metadata: '',
    weight: null,
  });

  fullData.message_id.author = userId;

  return dispatch({
    [COMMUN_API]: {
      types: [CREATE_POST, CREATE_POST_SUCCESS, CREATE_POST_ERROR],
      contract: 'publication',
      addSystemActor: 'c.gallery',
      method: 'create',
      params: fullData,
    },
    meta: fullData,
  });
};

export const update = data => async dispatch => {
  const fullData = defaults(data, {
    community_code: '',
    message_id: {
      author: '',
      permlink: '',
    },
    header: '',
    body: '',
    tags: [],
    metadata: '',
  });

  return dispatch({
    [COMMUN_API]: {
      types: [UPDATE_POST, UPDATE_POST_SUCCESS, UPDATE_POST_ERROR],
      contract: 'publication',
      addSystemActor: 'c.gallery',
      method: 'update',
      params: fullData,
    },
    meta: fullData,
  });
};

export const removeComment = (data, { commentId }) => async dispatch => {
  const fullData = defaults(data, {
    community_code: '',
    message_id: {
      author: '',
      permlink: '',
    },
  });

  return dispatch({
    [COMMUN_API]: {
      types: [DELETE_COMMENT, DELETE_COMMENT_SUCCESS, DELETE_COMMENT_ERROR],
      contract: 'publication',
      addSystemActor: 'c.gallery',
      method: 'remove',
      params: fullData,
    },
    meta: {
      ...fullData,
      commentId,
    },
  });
};

export const removePost = (data, { postId }) => async dispatch => {
  const fullData = defaults(data, {
    community_code: '',
    message_id: {
      author: '',
      permlink: '',
    },
  });

  return dispatch({
    [COMMUN_API]: {
      types: [DELETE_POST, DELETE_POST_SUCCESS, DELETE_POST_ERROR],
      contract: 'publication',
      addSystemActor: 'c.gallery',
      method: 'remove',
      params: fullData,
    },
    meta: {
      ...fullData,
      postId,
    },
  });
};

export const vote = (action, data) => async dispatch => {
  const loggedUserId = await dispatch(checkAuth());

  const fullData = defaults(data, {
    commun_code: null,
    voter: '',
    message_id: null,
  });

  fullData.voter = loggedUserId;

  if (action === UPVOTE || action === DOWNVOTE) {
    fullData.weight = null;
  }

  return dispatch(
    handleNoBalance(data.commun_code, {
      [COMMUN_API]: {
        types: [VOTE_POST, VOTE_POST_SUCCESS, VOTE_POST_ERROR],
        contract: 'publication',
        addSystemActor: 'c.gallery',
        method: action,
        params: fullData,
      },
      meta: {
        ...fullData,
        action,
      },
    })
  );
};

export const report = (contentId, reason) => async dispatch => {
  const userId = await dispatch(checkAuth());

  const params = {
    commun_code: contentId.communityId,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    reporter: userId,
    reason,
  };

  return dispatch(
    handleNoBalance(contentId.communityId, {
      [COMMUN_API]: {
        types: [SEND_REPORT, SEND_REPORT_SUCCESS, SEND_REPORT_ERROR],
        contract: 'publication',
        addSystemActor: 'c.gallery',
        method: 'report',
        params,
      },
      meta: params,
    })
  );
};
