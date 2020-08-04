/* eslint-disable no-param-reassign */
import { mergeEntities } from 'utils/store';

const initialState = {};

export default function reducerEntitiesDonations(state = initialState, { type, payload }) {
  const donations = payload?.entities?.donations;

  if (donations) {
    state = mergeEntities(state, donations, {
      merge: true,
    });
  }

  switch (type) {
    default:
      return state;
  }
}
