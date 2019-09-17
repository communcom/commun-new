import {
  SET_SCREEN_ID,
  SET_PHONE_NUMBER,
  SET_LOC_DATA,
  SET_WISH_USERNAME,
  CLEAR_REGISTRATION_DATA,
  CLEAR_VERIFY_ERROR,
  CLEAR_REG_ERRORS,
  SET_LOCAL_STORAGE_DATA,
} from 'store/constants/actionTypes';

export function setScreenId(id) {
  return {
    type: SET_SCREEN_ID,
    payload: { id },
  };
}

export function setPhoneNumber(phoneNumber) {
  return {
    type: SET_PHONE_NUMBER,
    payload: { phoneNumber },
  };
}

export function setLocationData(locationData) {
  return {
    type: SET_LOC_DATA,
    payload: { locationData },
  };
}

export function setWishUsername(wishUsername) {
  return {
    type: SET_WISH_USERNAME,
    payload: { wishUsername },
  };
}

export function clearRegistrationData() {
  return {
    type: CLEAR_REGISTRATION_DATA,
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
    type: SET_LOCAL_STORAGE_DATA,
    payload: { data },
  };
}
