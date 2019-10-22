/* eslint-disable import/prefer-default-export */

import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_BECOME_LEADER } from 'store/constants';

export const openBecomeLeaderDialog = ({ communityId }) =>
  openModal(SHOW_MODAL_BECOME_LEADER, { communityId });
