/* eslint-disable import/prefer-default-export */

import { SHOW_MODAL_LOGIN, SHOW_MODAL_SIGNUP } from 'store/constants';
import { currentUserIdSelector } from 'store/selectors/auth';
import { openSignUpModal } from 'store/actions/modals';
import { openLoginModal } from 'store/actions/ui/login';

export const checkAuth = ({ allowLogin = false, type = SHOW_MODAL_LOGIN } = {}) => async (
  dispatch,
  getState
) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (loggedUserId) {
    return loggedUserId;
  }

  if (allowLogin) {
    let results;

    switch (type) {
      case SHOW_MODAL_SIGNUP:
        results = await dispatch(openSignUpModal());
        break;

      case SHOW_MODAL_LOGIN:
      default:
        results = await dispatch(openLoginModal());
        break;
    }

    if (results?.userId) {
      return results.userId;
    }
  }

  throw new Error('Unauthorized');
};
