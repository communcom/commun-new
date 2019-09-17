/* eslint-disable no-underscore-dangle */

import { path, map } from 'ramda';

import {
  AUTH_LOGOUT,
  MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
  MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS,
} from 'store/constants';
import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { type, payload }) {
  const entities = path(['entities', 'notifications'], payload);

  if (entities) {
    return mergeEntities(state, entities, {
      transform: notification => {
        const data = {
          ...notification,
          id: notification._id,
        };

        delete data._id;

        return data;
      },
    });
  }

  switch (type) {
    case AUTH_LOGOUT:
      return initialState;

    case MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS:
      return map(
        notification => ({
          ...notification,
          fresh: false,
        }),
        state
      );

    case MARK_ALL_NOTIFICATIONS_READ_SUCCESS:
      return map(
        notification => ({
          ...notification,
          unread: false,
        }),
        state
      );

    default:
      return state;
  }
}
