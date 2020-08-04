import {
  REG_CLEAR_DATA,
  REG_SET_FULL_PHONE_NUMBER,
  REG_SET_LOC_DATA,
  REG_SET_LOCAL_STORAGE_DATA,
  REG_SET_PHONE_NUMBER,
  REG_SET_SCREEN_ID,
  REG_SET_USER_ID,
  REG_SET_WISH_PASSWORD,
  REG_SET_WISH_USERNAME,
  SET_USERS_KEYS,
} from 'store/constants';

const initialState = {
  screenId: '',
  locationData: {
    code: '',
    country: '',
    countryCode: '',
  },
  userId: '',
  fullPhoneNumber: '',
  phoneNumber: '',
  wishUsername: '',
  wishPassword: '',
  keys: {},
};

export default function reducerDataRegistration(state = initialState, { type, payload = {} }) {
  switch (type) {
    case REG_SET_SCREEN_ID:
      return {
        ...state,
        screenId: payload.id,
      };

    case REG_SET_PHONE_NUMBER:
      return {
        ...state,
        phoneNumber: payload.phoneNumber,
      };

    case REG_SET_FULL_PHONE_NUMBER:
      return {
        ...state,
        fullPhoneNumber: payload.fullPhoneNumber,
      };

    case REG_SET_LOC_DATA:
      return {
        ...state,
        locationData: payload.locationData,
      };

    case REG_SET_WISH_USERNAME:
      return {
        ...state,
        wishUsername: payload.wishUsername,
      };

    case REG_SET_WISH_PASSWORD:
      return {
        ...state,
        wishPassword: payload.wishPassword,
      };

    case REG_SET_USER_ID:
      return {
        ...state,
        userId: payload.userId,
      };

    case SET_USERS_KEYS:
      return {
        ...state,
        keys: payload.keys,
      };

    case REG_SET_LOCAL_STORAGE_DATA:
      return {
        ...state,
        ...payload.data,
      };

    case REG_CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
}
