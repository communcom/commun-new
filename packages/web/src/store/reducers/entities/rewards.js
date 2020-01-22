/* eslint-disable no-param-reassign */
import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { type, payload }) {
  const rewards = payload?.entities?.rewards;

  if (rewards) {
    state = mergeEntities(state, rewards, {
      merge: true,
    });
  }

  switch (type) {
    default:
      return state;
  }
}
