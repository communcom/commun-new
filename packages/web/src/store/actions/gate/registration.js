/* eslint-disable consistent-return */
import { isEmpty } from 'ramda';
import { generateKeys } from 'commun-client/lib/auth';
import { selectFeatureFlags } from '@flopflip/react-redux';

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
import { setRegistrationData, getRegistrationData } from 'utils/localStore';
import { stepToScreenId } from 'utils/registration';
import { setUserId } from 'store/actions/registration';
import {
  FETCH_ONBOARDING_COMMUNITY_SUBSCRIPTIONS,
  FETCH_ONBOARDING_COMMUNITY_SUBSCRIPTIONS_ERROR,
  FETCH_ONBOARDING_COMMUNITY_SUBSCRIPTIONS_SUCCESS,
} from 'store/constants';
import { resetCookies } from 'utils/cookies';
import { displayError } from 'utils/toastsMessages';
import { CREATE_PASSWORD_SCREEN_ID, MASTER_KEY_SCREEN_ID } from 'shared/constants';
import { FEATURE_REGISTRATION_PASSWORD } from 'shared/featureFlags';
import { gateLogin } from './auth';

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

export const fetchRegFirstStep = (phoneNumber, captcha, referralId) => async (
  dispatch,
  getState
) => {
  dispatch({
    type: REG_SET_FULL_PHONE_NUMBER,
    payload: { fullPhoneNumber: phoneNumber },
  });
  setRegistrationData({ fullPhoneNumber: phoneNumber });

  const params = {
    phone: phoneNumber,
    captcha,
    captchaType: 'web',
  };

  if (referralId) {
    params.referralId = referralId;
  }

  try {
    await dispatch({
      [CALL_GATE]: {
        types: [FETCH_REG_FIRST_STEP, FETCH_REG_FIRST_STEP_SUCCESS, FETCH_REG_FIRST_STEP_ERROR],
        method: 'registration.firstStep',
        params,
      },
      meta: params,
    });
  } catch ({ originalMessage, code, currentState }) {
    if (originalMessage === INVALID_STEP_TAKEN) {
      // TODO: temp until custom passwords release
      const featureFlags = selectFeatureFlags(getState());
      return stepToScreenId(currentState, featureFlags);
    }
    if (code > 0) {
      dispatch(setFirstStepError(originalMessage));
      throw originalMessage;
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
      // TODO: temp until custom passwords release
      const featureFlags = selectFeatureFlags(getState());
      return stepToScreenId(currentState, featureFlags);
    }
    throw originalMessage;
  }
};

export const fetchSetUser = username => async (dispatch, getState) => {
  const { type, identity } = getRegistrationData();

  const params = {
    username,
  };

  switch (type) {
    case 'oauth':
      params.identity = identity;
      break;
    default:
      params.phone = fullNumberSelector(getState());
  }

  // TODO: temp until custom passwords release
  const featureFlags = selectFeatureFlags(getState());

  try {
    const result = await dispatch({
      [CALL_GATE]: {
        types: [FETCH_REG_SET_USER, FETCH_REG_SET_USER_SUCCESS, FETCH_REG_SET_USER_ERROR],
        method: 'registration.setUsername',
        params,
      },
    });

    setRegistrationData({ userId: result.userId });
    resetCookies(['commun_oauth_identity']);
    dispatch(setUserId(result.userId));

    return featureFlags[FEATURE_REGISTRATION_PASSWORD]
      ? CREATE_PASSWORD_SCREEN_ID
      : MASTER_KEY_SCREEN_ID;
  } catch ({ originalMessage, currentState }) {
    if (originalMessage === INVALID_STEP_TAKEN) {
      // TODO: temp until custom passwords release
      return stepToScreenId(currentState, featureFlags);
    }
    throw originalMessage;
  }
};

export const fetchToBlockChain = () => async (dispatch, getState) => {
  const regData = regDataSelector(getState());
  const {
    wishUsername: username,
    wishPassword: password,
    fullPhoneNumber: phone,
    userId,
  } = regData;

  if (regData.isRegFinished) {
    return;
  }

  const { type, identity } = getRegistrationData();
  const params = {};

  switch (type) {
    case 'oauth':
      params.identity = identity;
      break;
    default:
      params.phone = phone;
  }

  dispatch({
    type: START_REG_BLOCK_CHAIN,
  });

  if (isEmpty(regData.keys)) {
    const generatedKeys = await generateKeys(userId, password);

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
          ...params,
          publicOwnerKey: keys.owner.publicKey,
          publicActiveKey: keys.active.publicKey,
        },
      },
    });

    setRegistrationData({ isRegFinished: true });
  } catch ({ originalMessage, currentState }) {
    if (originalMessage === INVALID_STEP_TAKEN) {
      // TODO: temp until custom passwords release
      const featureFlags = selectFeatureFlags(getState());
      return stepToScreenId(currentState, featureFlags);
    }
    throw originalMessage;
  }

  try {
    await dispatch(
      gateLogin(
        {
          username,
          password: keys.master,
          activePrivateKey: keys.active.privateKey,
        },
        { needSaveAuth: true }
      )
    );
  } catch (err) {
    displayError('Authorization failed:', err);
  }

  return {
    keys,
    userId,
    username,
    phone,
  };
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
