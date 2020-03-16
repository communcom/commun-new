import {
  PHONE_SCREEN_ID,
  CONFIRM_CODE_SCREEN_ID,
  CREATE_USERNAME_SCREEN_ID,
  MASTER_KEY_SCREEN_ID,
  REGISTERED_SCREEN_ID,
} from 'shared/constants';

// eslint-disable-next-line import/prefer-default-export, consistent-return
export function stepToScreenId(step) {
  switch (step) {
    case 'firstStep':
      return PHONE_SCREEN_ID;
    case 'verify':
      return CONFIRM_CODE_SCREEN_ID;
    case 'setUsername':
      return CREATE_USERNAME_SCREEN_ID;
    case 'toBlockChain':
      return MASTER_KEY_SCREEN_ID;
    case 'registered':
      return REGISTERED_SCREEN_ID;
    default:
  }
}
