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
import { currentUserIdSelector } from 'store/selectors/auth';
import { handleNoBalance } from 'store/actions/commun';

import { defaults } from 'utils/common';

export const createmssg = data => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

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
    curators_prcnt: 5000,
    weight: null,
  });

  fullData.message_id.author = userId;

  return dispatch({
    [COMMUN_API]: {
      types: [CREATE_POST, CREATE_POST_SUCCESS, CREATE_POST_ERROR],
      contract: 'publication',
      method: 'createmssg',
      params: fullData,
    },
    meta: fullData,
  });
};

export const updatemssg = data => async dispatch => {
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
      method: 'updatemssg',
      params: fullData,
    },
    meta: fullData,
  });
};

export const deletemssg = (data, parentContentId = null) => async dispatch => {
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
      method: 'deletemssg',
      params: fullData,
    },
    meta: {
      ...fullData,
      parentContentId,
    },
  });
};

export const vote = data => async (dispatch, getState) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (!loggedUserId) {
    throw new Error('Unauthorized');
  }

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

export const report = (contentId, reason) => (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

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
        method: 'reportmssg',
        params,
      },
      meta: params,
    })
  );
};
