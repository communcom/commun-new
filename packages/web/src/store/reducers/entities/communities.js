import u from 'updeep';

import { mergeEntities } from 'utils/store';
import { JOIN_COMMUNITY_SUCCESS, LEAVE_COMMUNITY_SUCCESS } from 'store/constants';

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
      merge: true,
    });
  }

  switch (type) {
    case JOIN_COMMUNITY_SUCCESS:
      return u.updateIn(
        [meta.communityId],
        community => ({
          ...community,
          subscribersCount: community.subscribersCount + 1,
          isSubscribed: true,
        }),
        state
      );

    case LEAVE_COMMUNITY_SUCCESS:
      return u.updateIn(
        [meta.communityId],
        community => ({
          ...community,
          subscribersCount: community.subscribersCount - 1,
          isSubscribed: false,
        }),
        state
      );

    default:
      return state;
  }
}
