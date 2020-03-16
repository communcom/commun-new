import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_LOGIN, SHOW_MODAL_ONBOARDING_APP_BANNER } from 'store/constants';
import { modeSelector } from 'store/selectors/common';

// eslint-disable-next-line import/prefer-default-export
export const openLoginModal = () => (dispatch, getState) => {
  const { screenType, isWebView } = modeSelector(getState());

  if ((screenType === 'mobile' || screenType === 'mobileLandscape') && !isWebView) {
    return dispatch(openModal(SHOW_MODAL_ONBOARDING_APP_BANNER));
  }

  return dispatch(openModal(SHOW_MODAL_LOGIN));
};
