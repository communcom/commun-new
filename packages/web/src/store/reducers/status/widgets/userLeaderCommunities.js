import u from 'updeep';

import { FETCH_USER_LEADER_COMMUNITIES_SUCCESS } from 'store/constants/actionTypes';

const initialState = {};

export default function reducerStatusWidgetsUserLeaderCommunities(
  state = initialState,
  { type, payload, meta }
) {
  switch (type) {
    case FETCH_USER_LEADER_COMMUNITIES_SUCCESS:
      return u.updateIn([meta.userId], payload.result.items, state);

    default:
      return state;
  }
}
