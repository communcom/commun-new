/* eslint-disable no-case-declarations */
import u from 'updeep';

import { mergeEntities } from 'utils/store';
import {
  AUTH_LOGOUT_SUCCESS,
  BECOME_LEADER_SUCCESS,
  BLOCK_COMMUNITY,
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY,
  STOP_LEADER_SUCCESS,
  UNBLOCK_COMMUNITY,
  UNREG_LEADER_SUCCESS,
} from 'store/constants';

const initialState = {};

export default function reducerEntitiesCommunities(state = initialState, { type, payload, meta }) {
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
    // optimistic
    case JOIN_COMMUNITY:
      if (state[meta.communityId]) {
        return u.updateIn(
          [meta.communityId],
          community => ({
            ...community,
            subscribersCount: community.subscribersCount + 1,
            isSubscribed: true,
          }),
          state
        );
      }

      return state;

    // optimistic
    case LEAVE_COMMUNITY:
      if (state[meta.communityId]) {
        return u.updateIn(
          [meta.communityId],
          community => ({
            ...community,
            subscribersCount: community.subscribersCount - 1,
            isSubscribed: false,
          }),
          state
        );
      }

      return state;

    case BECOME_LEADER_SUCCESS:
      return u.updateIn([meta.communityId, 'isLeader'], true, state);

    case STOP_LEADER_SUCCESS:
    case UNREG_LEADER_SUCCESS:
      return u.updateIn([meta.communityId, 'isLeader'], false, state);

    case AUTH_LOGOUT_SUCCESS:
      return u.map(
        community => ({
          ...community,
          isSubscribed: false,
        }),
        state
      );

    case BLOCK_COMMUNITY:
      return u.updateIn([meta.communityId, 'isInBlacklist'], true, state);

    case UNBLOCK_COMMUNITY:
      return u.updateIn([meta.communityId, 'isInBlacklist'], false, state);

    default:
      return state;
  }
}
