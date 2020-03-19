/* eslint-disable import/prefer-default-export */

import { openModal as openModalRedux } from 'redux-modals-manager';

import {
  SHOW_MODAL_BECOME_LEADER,
  SHOW_MODAL_ONBOARDING_REGISTRATION,
  SHOW_MODAL_ONBOARDING_WELCOME,
  SHOW_MODAL_SIGNUP,
} from 'store/constants';
import { DuplicateModalError } from 'utils/errors';

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
