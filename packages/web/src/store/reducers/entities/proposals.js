/* eslint-disable no-param-reassign */

import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { payload }) {
  const proposals = payload?.entities?.proposals;

  if (proposals) {
    state = mergeEntities(state, proposals, {
      merge: true,
    });
  }

  return state;
}
