import {
  PHONE_SCREEN_ID,
  REGISTERED_SCREEN_ID,
  CONFIRM_CODE_SCREEN_ID,
  CREATE_USERNAME_SCREEN_ID,
  CREATE_PASSWORD_SCREEN_ID,
  MASTER_KEY_SCREEN_ID,
} from 'shared/constants';
import { FEATURE_REGISTRATION_PASSWORD } from 'shared/featureFlags';

// eslint-disable-next-line import/prefer-default-export, consistent-return
export function stepToScreenId(step, featureFlags = {}) {
  switch (step) {
    case 'registered':
      return REGISTERED_SCREEN_ID;
    case 'firstStep':
      return PHONE_SCREEN_ID;
    case 'verify':
      return CONFIRM_CODE_SCREEN_ID;
    case 'setUsername':
      return CREATE_USERNAME_SCREEN_ID;
    case 'toBlockChain':
      return featureFlags[FEATURE_REGISTRATION_PASSWORD]
        ? CREATE_PASSWORD_SCREEN_ID
        : MASTER_KEY_SCREEN_ID;
    default:
  }
}