import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { payload }) {
  const entities = payload?.entities?.communities;

  if (entities) {
    return mergeEntities(state, entities, {
      transform: community => ({
        ...community,
        id: community.communityId,
        name: community.name || community.communityId,
      }),
    });
  }

  return state;
}
