import {
  REG_SET_SCREEN_ID,
  REG_SET_PHONE_NUMBER,
  REG_SET_LOC_DATA,
  REG_SET_WISH_USERNAME,
  REG_SET_WISH_PASSWORD,
  REG_SET_USER_ID,
  REG_CLEAR_DATA,
  CLEAR_VERIFY_ERROR,
  CLEAR_REG_ERRORS,
  REG_SET_LOCAL_STORAGE_DATA,
} from 'store/constants/actionTypes';

export function setScreenId(id) {
  return {
    type: REG_SET_SCREEN_ID,
    payload: { id },
  };
}

export function setPhoneNumber(phoneNumber) {
  return {
    type: REG_SET_PHONE_NUMBER,
    payload: { phoneNumber },
  };
}

export function setLocationData(locationData) {
  return {
    type: REG_SET_LOC_DATA,
    payload: { locationData },
  };
}

export function setWishUsername(wishUsername) {
  return {
    type: REG_SET_WISH_USERNAME,
    payload: { wishUsername },
  };
}

export function setWishPassword(wishPassword) {
  return {
    type: REG_SET_WISH_PASSWORD,
    payload: { wishPassword },
  };
}

export function setUserId(userId) {
  return {
    type: REG_SET_USER_ID,
    payload: { userId },
  };
}

export function clearRegistrationData() {
  return {
    type: REG_CLEAR_DATA,
  };
}

export function clearVerifyError() {
  return {
    type: CLEAR_VERIFY_ERROR,
  };
}

export function clearRegErrors() {
  return {
    type: CLEAR_REG_ERRORS,
  };
}

export function setLocalStorageData(data) {
  return {
    type: REG_SET_LOCAL_STORAGE_DATA,
    payload: { data },
  };
}
