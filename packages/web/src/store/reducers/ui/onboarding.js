import { CLOSE_ONBOARDING_BANNER } from 'store/constants/actionTypes';

const initialState = {
  isOnboardingBannerClosed: false,
};

export default function(state = initialState, { type }) {
  switch (type) {
    case CLOSE_ONBOARDING_BANNER:
      return {
        ...state,
        isOnboardingBannerClosed: true,
      };
    default:
      return state;
  }
}
