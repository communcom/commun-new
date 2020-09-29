import { TOGGLE_FEATURE_FLAGS } from 'store/constants';

export function toggleFeatureFlags() {
  return {
    type: TOGGLE_FEATURE_FLAGS,
    payload: {},
  };
}
