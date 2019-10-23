/* eslint-disable no-param-reassign */

import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { payload, meta }) {
  if (payload?.entities) {
    const { leaders } = payload.entities;

    if (leaders) {
      state = mergeEntities(state, leaders, {
        transform: leader => ({
          ...leader,
          communityId: meta.communityId,
        }),
      });
    }
  }

  return state;
}
