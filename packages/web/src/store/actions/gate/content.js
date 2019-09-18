import { CALL_GATE } from 'store/middlewares/gate-api';
import {
  FETCH_WAIT_BLOCK,
  FETCH_WAIT_BLOCK_SUCCESS,
  FETCH_WAIT_BLOCK_ERROR,
  FETCH_WAIT_TRX_CONTENT,
  FETCH_WAIT_TRX_CONTENT_SUCCESS,
  FETCH_WAIT_TRX_CONTENT_ERROR,
  FETCH_LEADERS,
  FETCH_LEADERS_SUCCESS,
  FETCH_LEADERS_ERROR,
  FETCH_SUBSCRIPTIONS,
  FETCH_SUBSCRIPTIONS_SUCCESS,
  FETCH_SUBSCRIPTIONS_ERROR,
  FETCH_SUBSCRIBERS,
  FETCH_SUBSCRIBERS_SUCCESS,
  FETCH_SUBSCRIBERS_ERROR,
} from 'store/constants/actionTypes';
import { userSchema } from '../../schemas/gate';

export const waitForBlock = blockNum => {
  const params = {
    blockNum,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_WAIT_BLOCK, FETCH_WAIT_BLOCK_SUCCESS, FETCH_WAIT_BLOCK_ERROR],
      method: 'content.waitForBlock',
      params,
    },
    meta: params,
  };
};

export const waitForTransaction = transactionId => {
  const params = {
    transactionId,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_WAIT_TRX_CONTENT, FETCH_WAIT_TRX_CONTENT_SUCCESS, FETCH_WAIT_TRX_CONTENT_ERROR],
      method: 'content.waitForTransaction',
      params,
    },
    meta: params,
  };
};

export const fetchLeaders = ({ communityId, sequenceKey } = {}) => {
  const params = {
    communityId,
    limit: 20,
    sequenceKey,
    app: 'gls',
  };

  return {
    [CALL_GATE]: {
      method: 'content.getLeadersTop',
      types: [FETCH_LEADERS, FETCH_LEADERS_SUCCESS, FETCH_LEADERS_ERROR],
      params,
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  };
};

export const getSubscriptions = ({ userId, sequenceKey = null } = {}) => {
  const params = {
    userId,
    limit: 20,
    sequenceKey,
    app: 'gls',
  };

  return {
    [CALL_GATE]: {
      method: 'content.getSubscriptions',
      types: [FETCH_SUBSCRIPTIONS, FETCH_SUBSCRIPTIONS_SUCCESS, FETCH_SUBSCRIPTIONS_ERROR],
      params,
      schema: {
        items: [userSchema],
      },
    },
    meta: {
      ...params,
      needAuth: true,
    },
  };
};

export const getSubscribers = ({ userId, sequenceKey = null } = {}) => {
  const params = {
    userId,
    limit: 20,
    sequenceKey,
    app: 'gls',
  };

  return {
    [CALL_GATE]: {
      method: 'content.getSubscribers',
      types: [FETCH_SUBSCRIBERS, FETCH_SUBSCRIBERS_SUCCESS, FETCH_SUBSCRIBERS_ERROR],
      params,
      schema: {
        items: [userSchema],
      },
    },
    meta: {
      ...params,
      needAuth: true,
    },
  };
};
