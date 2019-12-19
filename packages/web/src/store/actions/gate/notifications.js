import { notificationSchema } from 'store/schemas/gate';
import {
  FETCH_NOTIFICATIONS_COUNT,
  FETCH_NOTIFICATIONS_COUNT_SUCCESS,
  FETCH_NOTIFICATIONS_COUNT_ERROR,
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
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

export const getNotificationsCount = () => ({
  [CALL_GATE]: {
    types: [
      FETCH_NOTIFICATIONS_COUNT,
      FETCH_NOTIFICATIONS_COUNT_SUCCESS,
      FETCH_NOTIFICATIONS_COUNT_ERROR,
    ],
    method: 'onlineNotify.historyFresh',
  },
  meta: {
    waitAutoLogin: true,
  },
});

export const fetchNotifications = () => {
  const params = {
    limit: 20,
    // markAsViewed: false,
    // fromId,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_NOTIFICATIONS, FETCH_NOTIFICATIONS_SUCCESS, FETCH_NOTIFICATIONS_ERROR],
      method: 'notify.getNotifications',
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
    method: 'notify.markAllAsRead',
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
      method: 'notify.markAsRead',
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
    method: 'notify.markAllAsViewed',
  },
  meta: {
    waitAutoLogin: true,
  },
});
