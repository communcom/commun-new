/* eslint-disable import/prefer-default-export */

import { openModal as openModalRedux } from 'redux-modals-manager';
import {
  SHOW_MODAL_BECOME_LEADER,
  SHOW_MODAL_LOGIN,
  SHOW_MODAL_ONBOARDING_REGISTRATION,
  SHOW_MODAL_ONBOARDING_WELCOME,
  SHOW_MODAL_SIGNUP,
  // SHOW_MODAL_ONBOARDING_APP_BANNER,
  SHOW_MODAL_CREATE_COMMUNITY_CONFIRMATION,
  SHOW_MODAL_CREATE_COMMUNITY_NOT_ENOUGH,
} from 'store/constants';
import { DuplicateModalError } from 'utils/errors';
// import { modeSelector } from 'store/selectors/common';

export const openModal = (modalType, params) => (dispatch, getState) => {
  const { modals } = getState();

  if (modals.some(({ type }) => type === modalType)) {
    throw new DuplicateModalError();
  }

  return dispatch(openModalRedux(modalType, params));
};

export const openBecomeLeaderDialog = ({ communityId }) =>
  openModal(SHOW_MODAL_BECOME_LEADER, { communityId });

export const openOnboardingWelcome = () => openModal(SHOW_MODAL_ONBOARDING_WELCOME);

export const openOnboardingRegistration = (params = {}) =>
  openModal(SHOW_MODAL_ONBOARDING_REGISTRATION, params);

export const openSignUpModal = (params = {}) => openModal(SHOW_MODAL_SIGNUP, params);

// eslint-disable-next-line arrow-body-style
export const openLoginModal = (params = {}) => dispatch => {
  // https://github.com/communcom/commun/issues/2267
  // const { screenType, isWebView } = modeSelector(getState());
  //
  // if ((screenType === 'mobile' || screenType === 'mobileLandscape') && !isWebView) {
  //   return dispatch(openModal(SHOW_MODAL_ONBOARDING_APP_BANNER));
  // }

  return dispatch(openModal(SHOW_MODAL_LOGIN, params));
};

export const openCreateCommunityConfirmationModal = (params = {}) =>
  openModal(SHOW_MODAL_CREATE_COMMUNITY_CONFIRMATION, params);

export const openNotEnoughCommunsModal = (params = {}) =>
  openModal(SHOW_MODAL_CREATE_COMMUNITY_NOT_ENOUGH, params);
