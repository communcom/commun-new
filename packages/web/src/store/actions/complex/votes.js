/* eslint-disable import/prefer-default-export */
import { BEGIN, COMMIT, REVERT } from 'redux-optimist';

import { SET_POST_VOTE, SET_COMMENT_VOTE } from 'store/constants';
import { vote as communVote } from 'store/actions/commun/publish';
import { formatContentId } from 'store/schemas/gate';

let nextTransactionID = 0;

export const vote = ({ action, type, contentId }) => async dispatch => {
  const actionType = type === 'post' ? SET_POST_VOTE : SET_COMMENT_VOTE;
  const transactionID = `${actionType}-${nextTransactionID++}`;
  let result;

  // optimistic
  dispatch({
    type: actionType,
    payload: {
      id: formatContentId(contentId),
    },
    meta: {
      action,
    },
    optimist: { type: BEGIN, id: transactionID },
  });

  try {
    result = await dispatch(
      communVote(action, {
        commun_code: contentId.communityId,
        message_id: {
          author: contentId.userId,
          permlink: contentId.permlink,
        },
      })
    );

    dispatch({
      type: `${actionType}_SUCCESS`,
      optimist: { type: COMMIT, id: transactionID },
    });
  } catch (e) {
    dispatch({
      type: `${actionType}_ERROR`,
      optimist: { type: REVERT, id: transactionID },
    });

    throw e;
  }

  return result;
};
