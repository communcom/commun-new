/* eslint-disable no-param-reassign */

import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { payload }) {
  if (payload?.entities) {
    const { leaders } = payload.entities;

    if (leaders) {
      state = mergeEntities(state, leaders);
    }
  }

  return state;
}
