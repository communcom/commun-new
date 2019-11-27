/* eslint-disable consistent-return */
import { isEmpty } from 'ramda';
import { generateKeys } from 'commun-client/lib/auth';

import {
  FETCH_REG_FIRST_STEP,
  FETCH_REG_FIRST_STEP_SUCCESS,
  FETCH_REG_FIRST_STEP_ERROR,
  SET_FIRST_STEP_ERROR,
  FIRST_STEP_STOP_LOADER,
  REG_SET_FULL_PHONE_NUMBER,
  FETCH_REG_VERIFY,
  FETCH_REG_VERIFY_SUCCESS,
  FETCH_REG_VERIFY_ERROR,
  FETCH_REG_SET_USER,
  FETCH_REG_SET_USER_SUCCESS,
  FETCH_REG_SET_USER_ERROR,
  FETCH_REG_BLOCK_CHAIN,
  FETCH_REG_BLOCK_CHAIN_SUCCESS,
  FETCH_REG_BLOCK_CHAIN_ERROR,
  SET_USERS_KEYS,
  START_REG_BLOCK_CHAIN,
  FETCH_RESEND_SMS,
  FETCH_RESEND_SMS_SUCCESS,
  FETCH_RESEND_SMS_ERROR,
  BLOCK_CHAIN_STOP_LOADER,
} from 'store/constants/actionTypes';

import { regDataSelector, fullNumberSelector } from 'store/selectors/registration';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { setRegistrationData } from 'utils/localStore';
import { createPdf, stepToScreenId } from 'components/modals/SignUp/utils';
import { setUserId } from 'store/actions/registration';
import {
  FETCH_ONBOARDING_COMMUNITY_SUBSCRIPTIONS,
  FETCH_ONBOARDING_COMMUNITY_SUBSCRIPTIONS_ERROR,
  FETCH_ONBOARDING_COMMUNITY_SUBSCRIPTIONS_SUCCESS,
} from 'store/constants';
import { gateLogin } from './auth';

const PHONE_ALREADY_REGISTERED = 'Phone already registered.';
const INVALID_STEP_TAKEN = 'Invalid step taken';

export const fetchResendSms = phone => async dispatch =>
  dispatch({
    [CALL_GATE]: {
      types: [FETCH_RESEND_SMS, FETCH_RESEND_SMS_SUCCESS, FETCH_RESEND_SMS_ERROR],
      method: 'registration.resendSmsCode',
      params: {
        phone,
      },
    },
  });

const setFirstStepError = err => ({
  type: SET_FIRST_STEP_ERROR,
  payload: { err },
});

export const fetchRegFirstStep = (phoneNumber, captcha) => async dispatch => {
  dispatch({
    type: REG_SET_FULL_PHONE_NUMBER,
    payload: { fullPhoneNumber: phoneNumber },
  });
  setRegistrationData({ fullPhoneNumber: phoneNumber });
  try {
    await dispatch({
      [CALL_GATE]: {
        types: [FETCH_REG_FIRST_STEP, FETCH_REG_FIRST_STEP_SUCCESS, FETCH_REG_FIRST_STEP_ERROR],
        method: 'registration.firstStep',
        params: {
          phone: phoneNumber,
          captcha,
          captchaType: 'web',
        },
      },
    });
  } catch ({ originalMessage, currentState }) {
    if (originalMessage === PHONE_ALREADY_REGISTERED) {
      dispatch(setFirstStepError('Phone has been already registered'));
      throw originalMessage;
    }
    if (originalMessage === INVALID_STEP_TAKEN) {
      return stepToScreenId(currentState);
    }
    dispatch(setFirstStepError('Unknown error.'));
    throw originalMessage;
  }
};

export const firstStepStopLoader = () => ({
  type: FIRST_STEP_STOP_LOADER,
});

export const fetchRegVerify = code => async (dispatch, getState) => {
  const phone = fullNumberSelector(getState());

  try {
    await dispatch({
      [CALL_GATE]: {
        types: [FETCH_REG_VERIFY, FETCH_REG_VERIFY_SUCCESS, FETCH_REG_VERIFY_ERROR],
        method: 'registration.verify',
        params: {
          phone,
          code,
        },
      },
    });
  } catch ({ originalMessage, currentState }) {
    if (originalMessage === INVALID_STEP_TAKEN) {
      return stepToScreenId(currentState);
    }
    throw originalMessage;
  }
};

export const fetchSetUser = username => async (dispatch, getState) => {
  const phone = fullNumberSelector(getState());

  try {
    const result = await dispatch({
      [CALL_GATE]: {
        types: [FETCH_REG_SET_USER, FETCH_REG_SET_USER_SUCCESS, FETCH_REG_SET_USER_ERROR],
        method: 'registration.setUsername',
        params: {
          username,
          phone,
        },
      },
    });

    setRegistrationData({ userId: result.userId });
    dispatch(setUserId(result.userId));
  } catch ({ originalMessage, currentState }) {
    if (originalMessage === INVALID_STEP_TAKEN) {
      return stepToScreenId(currentState);
    }
    throw originalMessage;
  }
};

export const fetchToBlockChain = () => async (dispatch, getState) => {
  const regData = regDataSelector(getState());
  const { wishUsername: username, fullPhoneNumber: phone, userId } = regData;

  if (regData.isRegFinished) {
    return;
  }

  dispatch({
    type: START_REG_BLOCK_CHAIN,
  });

  if (isEmpty(regData.keys)) {
    const generatedKeys = await generateKeys(userId);

    dispatch({
      type: SET_USERS_KEYS,
      payload: { keys: generatedKeys },
    });
  }

  const { keys } = regDataSelector(getState());

  try {
    await dispatch({
      [CALL_GATE]: {
        types: [FETCH_REG_BLOCK_CHAIN, FETCH_REG_BLOCK_CHAIN_SUCCESS, FETCH_REG_BLOCK_CHAIN_ERROR],
        method: 'registration.toBlockChain',
        params: {
          username,
          userId,
          phone,
          publicOwnerKey: keys.owner.publicKey,
          publicActiveKey: keys.active.publicKey,
          // TODO: memo
          // memo: ' ',
        },
      },
    });

    setRegistrationData({ isRegFinished: true });
  } catch ({ originalMessage, currentState }) {
    if (originalMessage === INVALID_STEP_TAKEN) {
      return stepToScreenId(currentState);
    }
    throw originalMessage;
  }

  createPdf({
    keys,
    userId,
    username,
    phone,
  });

  const authParams = {
    userId,
    username,
    privateKey: keys.active.privateKey,
  };

  await dispatch(gateLogin(authParams, { needSaveAuth: true }));
};

export const blockChainStopLoader = () => ({
  type: BLOCK_CHAIN_STOP_LOADER,
});

export const fetchOnboardingCommunitySubscriptions = ({
  userId,
  communityIds,
}) => async dispatch => {
  const params = {
    userId,
    communityIds,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [
        FETCH_ONBOARDING_COMMUNITY_SUBSCRIPTIONS,
        FETCH_ONBOARDING_COMMUNITY_SUBSCRIPTIONS_SUCCESS,
        FETCH_ONBOARDING_COMMUNITY_SUBSCRIPTIONS_ERROR,
      ],
      method: 'registration.onboardingCommunitySubscriptions',
      params,
    },
    meta: params,
  });
};
