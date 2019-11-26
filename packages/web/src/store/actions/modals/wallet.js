import { openModal } from 'redux-modals-manager';

import {
  SHOW_MODAL_CONVERT_POINTS,
  SHOW_MODAL_SEND_POINTS,
  SHOW_MODAL_SELECT_POINT,
  SHOW_MODAL_SELECT_RECIPIENT,
  SHOW_MODAL_POINT_INFO,
} from 'store/constants';

export const openModalConvertPoint = (options = {}) =>
  openModal(SHOW_MODAL_CONVERT_POINTS, options);

export const openModalSendPoint = (options = {}) => openModal(SHOW_MODAL_SEND_POINTS, options);

export const openModalSelectPoint = (options = {}) => openModal(SHOW_MODAL_SELECT_POINT, options);

export const openModalSelectRecipient = (options = {}) =>
  openModal(SHOW_MODAL_SELECT_RECIPIENT, options);

export const openModalPointInfo = (options = {}) => openModal(SHOW_MODAL_POINT_INFO, options);
