/* eslint-disable import/prefer-default-export */
import { BEGIN, COMMIT, REVERT } from 'redux-optimist';

import {
  RECORD_POST_VIEW,
  RECORD_POST_VIEW_SUCCESS,
  RECORD_POST_VIEW_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { formatContentId } from 'store/schemas/gate';
import { entitySelector } from 'store/selectors/common';

let nextTransactionID = 0;

export const recordPostView = contentId => async (dispatch, getState) => {
  const contentUrl = formatContentId(contentId);
  const post = entitySelector('posts', contentUrl)(getState());

  // don't record view if already viewed
  if (post.isViewed) {
    return;
  }

  const transactionID = `${RECORD_POST_VIEW}-${nextTransactionID++}`;

  // optimistic
  dispatch({
    type: RECORD_POST_VIEW,
    meta: { contentUrl },
    optimist: { type: BEGIN, id: transactionID },
  });

  try {
    dispatch({
      [CALL_GATE]: {
        method: 'meta.recordPostView',
        params: {
          postLink: contentUrl,
        },
      },
      meta: {
        contentUrl,
      },
    });

    // optimistic
    dispatch({
      type: RECORD_POST_VIEW_SUCCESS,
      meta: { contentUrl },
      optimist: { type: COMMIT, id: transactionID },
    });
  } catch (err) {
    // optimistic
    dispatch({
      type: RECORD_POST_VIEW_ERROR,
      meta: { contentUrl },
      optimist: { type: REVERT, id: transactionID },
    });
    throw err;
  }
};
