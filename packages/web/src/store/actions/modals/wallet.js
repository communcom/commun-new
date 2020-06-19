import { openModal } from 'store/actions/modals/common';
import {
  SHOW_MODAL_CONVERT_POINTS,
  SHOW_MODAL_EXCHANGE_3DS,
  SHOW_MODAL_EXCHANGE_COMMUN,
  SHOW_MODAL_HISTORY_FILTER,
  SHOW_MODAL_POINT_INFO,
  SHOW_MODAL_SELECT_POINT,
  SHOW_MODAL_SELECT_RECIPIENT,
  SHOW_MODAL_SELECT_TOKEN,
  SHOW_MODAL_SELL_COMMUN,
  SHOW_MODAL_SEND_POINTS,
} from 'store/constants';

export const openModalConvertPoint = (options = {}) =>
  openModal(SHOW_MODAL_CONVERT_POINTS, options);

export const openModalExchangeCommun = (options = {}) =>
  openModal(SHOW_MODAL_EXCHANGE_COMMUN, options);

export const openModalExchange3DS = (options = {}) => openModal(SHOW_MODAL_EXCHANGE_3DS, options);

export const openModalSellCommun = (options = {}) => openModal(SHOW_MODAL_SELL_COMMUN, options);

export const openModalSendPoint = (options = {}) => openModal(SHOW_MODAL_SEND_POINTS, options);

export const openModalSelectPoint = (options = {}) => openModal(SHOW_MODAL_SELECT_POINT, options);
export const openModalSelectToken = (options = {}) => openModal(SHOW_MODAL_SELECT_TOKEN, options);

export const openModalSelectRecipient = (options = {}) =>
  openModal(SHOW_MODAL_SELECT_RECIPIENT, options);

export const openModalPointInfo = (options = {}) => openModal(SHOW_MODAL_POINT_INFO, options);

export const openModalHistoryFilter = (options = {}) =>
  openModal(SHOW_MODAL_HISTORY_FILTER, options);
