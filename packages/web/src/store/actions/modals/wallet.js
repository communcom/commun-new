import { openModal } from 'redux-modals-manager';

import {
  SHOW_MODAL_CONVERT_POINTS,
  SHOW_MODAL_EXCHANGE_COMMUN,
  SHOW_MODAL_SEND_POINTS,
  SHOW_MODAL_SELECT_POINT,
  SHOW_MODAL_SELECT_RECIPIENT,
  SHOW_MODAL_POINT_INFO,
  SHOW_MODAL_HISTORY_FILTER,
} from 'store/constants';

export const openModalConvertPoint = (options = {}) =>
  openModal(SHOW_MODAL_CONVERT_POINTS, options);

export const openModalExchangeCommun = (options = {}) =>
  openModal(SHOW_MODAL_EXCHANGE_COMMUN, options);

export const openModalSendPoint = (options = {}) => openModal(SHOW_MODAL_SEND_POINTS, options);

export const openModalSelectPoint = (options = {}) => openModal(SHOW_MODAL_SELECT_POINT, options);

export const openModalSelectRecipient = (options = {}) =>
  openModal(SHOW_MODAL_SELECT_RECIPIENT, options);

export const openModalPointInfo = (options = {}) => openModal(SHOW_MODAL_POINT_INFO, options);

export const openModalHistoryFilter = (options = {}) =>
  openModal(SHOW_MODAL_HISTORY_FILTER, options);
