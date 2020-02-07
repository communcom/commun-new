/* eslint-disable import/prefer-default-export */

import { currentUserIdSelector } from 'store/selectors/auth';
import { openLoginModal } from 'store/actions/ui/login';

export const checkAuth = allowLogin => async (dispatch, getState) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (loggedUserId) {
    return loggedUserId;
  }

  if (allowLogin) {
    const results = await dispatch(openLoginModal());

    if (results?.userId) {
      return results.userId;
    }
  }

  throw new Error('Unauthorized');
};
