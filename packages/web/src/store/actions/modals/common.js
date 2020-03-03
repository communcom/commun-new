/* eslint-disable import/prefer-default-export */

import { openModal } from 'redux-modals-manager';

import {
  SHOW_MODAL_BECOME_LEADER,
  SHOW_MODAL_ONBOARDING_REGISTRATION,
  SHOW_MODAL_ONBOARDING_WELCOME,
  SHOW_MODAL_SIGNUP,
} from 'store/constants';

export const openBecomeLeaderDialog = ({ communityId }) =>
  openModal(SHOW_MODAL_BECOME_LEADER, { communityId });

export const openOnboardingWelcome = () => openModal(SHOW_MODAL_ONBOARDING_WELCOME);

export const openOnboardingCommunities = (params = {}) =>
  openModal(SHOW_MODAL_ONBOARDING_REGISTRATION, params);

export const openSignUpModal = (params = {}) => openModal(SHOW_MODAL_SIGNUP, params);
