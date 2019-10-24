/* eslint-disable import/prefer-default-export */

import { currentUserIdSelector } from 'store/selectors/auth';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_LOGIN } from 'store/constants';

export const checkAuth = allowLogin => async (dispatch, getState) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (loggedUserId) {
    return loggedUserId;
  }

  if (allowLogin) {
    const results = await dispatch(openModal(SHOW_MODAL_LOGIN));

    if (results) {
      return results.userId;
    }
  }

  throw new Error('Unauthorized');
};
