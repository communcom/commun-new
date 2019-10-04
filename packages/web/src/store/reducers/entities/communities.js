import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { payload }) {
  const entities = payload?.entities?.communities;

  if (entities) {
    return mergeEntities(state, entities, {
      transform: community => ({
        ...community,
        name: community.name || community.id,
      }),
    });
  }

  return state;
}
