import {
  FETCH_TRAY_NOTIFICATIONS,
  FETCH_TRAY_NOTIFICATIONS_ERROR,
  FETCH_TRAY_NOTIFICATIONS_SUCCESS,
} from 'store/constants/actionTypes';

import { createNotificationsReducer } from './notifications';

export default createNotificationsReducer([
  FETCH_TRAY_NOTIFICATIONS,
  FETCH_TRAY_NOTIFICATIONS_SUCCESS,
  FETCH_TRAY_NOTIFICATIONS_ERROR,
]);
