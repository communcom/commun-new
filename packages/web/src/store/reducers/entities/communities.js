import u from 'updeep';

import { mergeEntities } from 'utils/store';
import { FOLLOW_COMMUNITY_SUCCESS } from 'store/constants';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  const entities = payload?.entities?.communities;

  if (entities) {
    // eslint-disable-next-line no-param-reassign
    state = mergeEntities(state, entities, {
      transform: community => ({
        ...community,
        id: community.communityId,
        name: community.name || community.communityId,
      }),
    });
  }

  switch (type) {
    case FOLLOW_COMMUNITY_SUCCESS:
      return u.updateIn(
        [meta.communityId],
        community => ({
          ...community,
          subscribersCount: community.subscribersCount + 1,
          isSubscribed: true,
        }),
        state
      );

    default:
      return state;
  }
}
