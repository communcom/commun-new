import { TOGGLE_FEATURE_FLAGS } from 'store/constants';

const INITIAL_STATE = {
  isFeatureFlagsShow: false,
};

export default function reducerUiCommon(state = INITIAL_STATE, { type }) {
  switch (type) {
    case TOGGLE_FEATURE_FLAGS:
      return {
        isFeatureFlagsShow: !state.isFeatureFlagsShow,
      };
    default:
      return state;
  }
}
