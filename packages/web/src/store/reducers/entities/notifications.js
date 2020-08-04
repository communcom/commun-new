/* eslint-disable no-underscore-dangle */

import map from 'ramda/src/map';
import path from 'ramda/src/path';

import { mergeEntities } from 'utils/store';
import { AUTH_LOGOUT, MARK_ALL_NOTIFICATIONS_READ_IN_STORE } from 'store/constants';

const initialState = {};

export default function reducerEntitiesNotifications(state = initialState, { type, payload }) {
  const entities = path(['entities', 'notifications'], payload);

  if (entities) {
    return mergeEntities(state, entities);
  }

  switch (type) {
    case AUTH_LOGOUT:
      return initialState;

    case MARK_ALL_NOTIFICATIONS_READ_IN_STORE:
      return map(
        notification => ({
          ...notification,
          isNew: notification.isNew
            ? new Date(notification.timestamp) <= new Date(payload.until)
            : notification.isNew,
        }),
        state
      );

    default:
      return state;
  }
}
