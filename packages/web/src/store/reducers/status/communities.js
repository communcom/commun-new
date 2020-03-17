import {
  FETCH_COMMUNITIES,
  FETCH_COMMUNITIES_SUCCESS,
  FETCH_COMMUNITIES_ERROR,
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY,
  CLEAR_ONBOARDING_COMMUNITIES,
} from 'store/constants/actionTypes';

import pagination from 'store/utils/pagination';

// eslint-disable-next-line consistent-return
function reducer(state, { type, meta }) {
  switch (type) {
    case JOIN_COMMUNITY:
      if (meta.isOnboarding) {
        return {
          ...state,
          onboardingSubscriptions: (state.onboardingSubscriptions || []).concat(meta.communityId),
        };
      }
      return state;

    case LEAVE_COMMUNITY:
      if (meta.isOnboarding) {
        return {
          ...state,
          onboardingSubscriptions: (state.onboardingSubscriptions || []).filter(
            id => id !== meta.communityId
          ),
        };
      }
      return state;

    case CLEAR_ONBOARDING_COMMUNITIES:
      return {
        ...state,
        onboardingSubscriptions: [],
      };

    default:
      return state;
  }
}

export default pagination([FETCH_COMMUNITIES, FETCH_COMMUNITIES_SUCCESS, FETCH_COMMUNITIES_ERROR])(
  reducer
);
