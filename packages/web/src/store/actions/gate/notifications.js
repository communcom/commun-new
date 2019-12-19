import { notificationSchema } from 'store/schemas/gate';
import {
  FETCH_NOTIFICATIONS_STATUS,
  FETCH_NOTIFICATIONS_STATUS_SUCCESS,
  FETCH_NOTIFICATIONS_STATUS_ERROR,
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
  FETCH_TRAY_NOTIFICATIONS,
  FETCH_TRAY_NOTIFICATIONS_SUCCESS,
  FETCH_TRAY_NOTIFICATIONS_ERROR,
  MARK_ALL_NOTIFICATIONS_VIEWED,
  MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS,
  MARK_ALL_NOTIFICATIONS_VIEWED_ERROR,
  MARK_ALL_NOTIFICATIONS_READ,
  MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
  MARK_ALL_NOTIFICATIONS_READ_ERROR,
  MARK_NOTIFICATION_READ,
  MARK_NOTIFICATION_READ_SUCCESS,
  MARK_NOTIFICATION_READ_ERROR,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const getNotificationsStatus = () => ({
  [CALL_GATE]: {
    types: [
      FETCH_NOTIFICATIONS_STATUS,
      FETCH_NOTIFICATIONS_STATUS_SUCCESS,
      FETCH_NOTIFICATIONS_STATUS_ERROR,
    ],
    method: 'notifications.getStatus',
  },
  meta: {
    waitAutoLogin: true,
  },
});

export const fetchNotifications = ({ beforeThan, isTray } = {}) => {
  const params = {
    limit: 20,
    beforeThan,
  };

  const actions = isTray
    ? [FETCH_TRAY_NOTIFICATIONS, FETCH_TRAY_NOTIFICATIONS_SUCCESS, FETCH_TRAY_NOTIFICATIONS_ERROR]
    : [FETCH_NOTIFICATIONS, FETCH_NOTIFICATIONS_SUCCESS, FETCH_NOTIFICATIONS_ERROR];

  return {
    [CALL_GATE]: {
      types: actions,
      method: 'notifications.getNotifications',
      params,
      schema: {
        items: [notificationSchema],
      },
    },
    meta: {
      waitAutoLogin: true,
      ...params,
    },
  };
};

export const markAllAsRead = () => ({
  [CALL_GATE]: {
    types: [
      MARK_ALL_NOTIFICATIONS_READ,
      MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
      MARK_ALL_NOTIFICATIONS_READ_ERROR,
    ],
    method: 'notifications.markAllAsRead',
  },
  meta: {
    waitAutoLogin: true,
  },
});

export const markAsRead = id => {
  let ids;

  if (Array.isArray(id)) {
    ids = id;
  } else {
    ids = [id];
  }

  const params = {
    ids,
  };

  return {
    [CALL_GATE]: {
      types: [MARK_NOTIFICATION_READ, MARK_NOTIFICATION_READ_SUCCESS, MARK_NOTIFICATION_READ_ERROR],
      method: 'notifications.markAsRead',
      params,
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  };
};

export const markAllAsViewed = () => ({
  [CALL_GATE]: {
    types: [
      MARK_ALL_NOTIFICATIONS_VIEWED,
      MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS,
      MARK_ALL_NOTIFICATIONS_VIEWED_ERROR,
    ],
    method: 'notifications.markAllAsViewed',
  },
  meta: {
    waitAutoLogin: true,
  },
});
