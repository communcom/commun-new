import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  CREATE_POST,
  CREATE_POST_SUCCESS,
  CREATE_POST_ERROR,
  UPDATE_POST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_ERROR,
  DELETE_CONTENT,
  DELETE_CONTENT_SUCCESS,
  DELETE_CONTENT_ERROR,
  VOTE_POST,
  VOTE_POST_SUCCESS,
  VOTE_POST_ERROR,
  SEND_REPORT,
  SEND_REPORT_SUCCESS,
  SEND_REPORT_ERROR,
} from 'store/constants/actionTypes';
import { handleNoBalance } from 'store/actions/commun';
import { checkAuth } from 'store/actions/complex';

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
      method: 'update',
      params: fullData,
    },
    meta: fullData,
  });
};

export const remove = (data, { commentContentId = null, postContentId }) => async dispatch => {
  const fullData = defaults(data, {
    community_code: '',
    message_id: {
      author: '',
      permlink: '',
    },
  });

  return dispatch({
    [COMMUN_API]: {
      types: [DELETE_CONTENT, DELETE_CONTENT_SUCCESS, DELETE_CONTENT_ERROR],
      contract: 'publication',
      method: 'remove',
      params: fullData,
    },
    meta: {
      ...fullData,
      commentContentId,
      postContentId,
    },
  });
};

export const vote = data => async dispatch => {
  const loggedUserId = await dispatch(checkAuth());

  const fullData = defaults(data, {
    commun_code: null,
    voter: '',
    message_id: null,
    weight: 0,
  });

  fullData.voter = loggedUserId;

  const { weight } = fullData;
  let methodName;

  if (weight === 0) {
    methodName = 'unvote';
    delete fullData.weight;
  } else if (weight < 0) {
    methodName = 'downvote';
    fullData.weight = Math.abs(weight);
  } else {
    methodName = 'upvote';
  }

  return dispatch(
    handleNoBalance(data.commun_code, {
      [COMMUN_API]: {
        types: [VOTE_POST, VOTE_POST_SUCCESS, VOTE_POST_ERROR],
        contract: 'publication',
        addSystemActor: 'c.gallery',
        method: methodName,
        params: fullData,
      },
      meta: {
        ...fullData,
        methodName,
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
