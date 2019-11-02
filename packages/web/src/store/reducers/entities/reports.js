/* eslint-disable no-param-reassign */

import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { type, payload }) {
  const reports = payload?.entities?.reports;

  if (reports) {
    state = mergeEntities(state, reports, {
      merge: true,
    });
  }

  switch (type) {
    default:
      return state;
  }
}
