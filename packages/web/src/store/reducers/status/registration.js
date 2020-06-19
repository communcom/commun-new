import { i18n } from 'shared/i18n';
import {
  BLOCK_CHAIN_STOP_LOADER,
  CLEAR_REG_ERRORS,
  CLEAR_VERIFY_ERROR,
  FETCH_REG_BLOCK_CHAIN_ERROR,
  FETCH_REG_FIRST_STEP,
  FETCH_REG_FIRST_STEP_SUCCESS,
  FETCH_REG_SET_USER,
  FETCH_REG_SET_USER_ERROR,
  FETCH_REG_SET_USER_SUCCESS,
  FETCH_REG_VERIFY,
  FETCH_REG_VERIFY_ERROR,
  FETCH_REG_VERIFY_SUCCESS,
  FETCH_RESEND_SMS,
  FETCH_RESEND_SMS_ERROR,
  FETCH_RESEND_SMS_SUCCESS,
  FIRST_STEP_STOP_LOADER,
  SET_FIRST_STEP_ERROR,
  START_REG_BLOCK_CHAIN,
} from 'store/constants/actionTypes';

const initialState = {
  isLoadingFirstStep: false,
  sendPhoneError: '',
  isLoadingVerify: false,
  sendVerifyError: '',
  isResendSmsLoading: false,
  resendSmsError: '',
  isLoadingSetUser: false,
  sendUserError: '',
  isLoadingBlockChain: false,
  blockChainError: '',
  nextSmsRetry: 0,
};

export default function(state = initialState, { type, payload, error }) {
  switch (type) {
    case FETCH_REG_FIRST_STEP:
      return {
        ...state,
        sendPhoneError: '',
        isLoadingFirstStep: true,
      };

    case FETCH_REG_FIRST_STEP_SUCCESS:
      return {
        ...state,
        nextSmsRetry: new Date(payload.nextSmsRetry).getTime(),
        isLoadingFirstStep: false,
      };

    case SET_FIRST_STEP_ERROR:
      return {
        ...state,
        sendPhoneError: payload.err,
      };

    case FIRST_STEP_STOP_LOADER:
      return {
        ...state,
        isLoadingFirstStep: false,
      };

    case FETCH_REG_VERIFY:
      return {
        ...state,
        sendVerifyError: '',
        isLoadingVerify: true,
      };

    case FETCH_REG_VERIFY_SUCCESS:
      return {
        ...state,
        isLoadingVerify: false,
      };

    case FETCH_REG_VERIFY_ERROR:
      // eslint-disable-next-line no-case-declarations
      let sendVerifyError = '';

      switch (error.code) {
        case 1104:
          sendVerifyError = i18n.t('errors.sms.wrong');
          break;
        default:
          if (error.code > 0) {
            sendVerifyError = error.originalMessage;
          } else {
            sendVerifyError = i18n.t('errors.common.unknown');
          }
      }

      return {
        ...state,
        sendVerifyError,
        isLoadingVerify: false,
      };

    case CLEAR_VERIFY_ERROR:
      return {
        ...state,
        sendVerifyError: '',
      };

    case FETCH_RESEND_SMS:
      return {
        ...state,
        isResendSmsLoading: true,
      };

    case FETCH_RESEND_SMS_SUCCESS:
      return {
        ...state,
        nextSmsRetry: new Date(payload.nextSmsRetry).getTime(),
        resendSmsError: '',
        isResendSmsLoading: false,
      };

    case FETCH_RESEND_SMS_ERROR:
      // eslint-disable-next-line no-case-declarations
      let resendSmsError = '';
      switch (error.code) {
        case 1108:
          resendSmsError = i18n.t('errors.sms.many_retries');
          break;
        case 1107:
          resendSmsError = i18n.t('errors.sms.later');
          break;
        case 1113:
          resendSmsError = i18n.t('errors.sms.cant');
          break;
        default:
          if (error.code > 0) {
            resendSmsError = error.originalMessage;
          } else {
            resendSmsError = i18n.t('errors.common.unknown');
          }
      }

      return {
        ...state,
        resendSmsError,
        isResendSmsLoading: false,
      };

    case FETCH_REG_SET_USER:
      return {
        ...state,
        sendUserError: '',
        isLoadingSetUser: true,
      };

    case FETCH_REG_SET_USER_SUCCESS:
      return {
        ...state,
        isLoadingSetUser: false,
      };

    case FETCH_REG_SET_USER_ERROR:
      // eslint-disable-next-line no-case-declarations
      let sendUserError = '';

      if (error.code === 1106) {
        sendUserError = i18n.t('errors.username.exists');
      } else if (error.code > 0) {
        sendUserError = error.originalMessage;
      } else {
        sendUserError = i18n.t('errors.common.unknown');
      }

      return {
        ...state,
        sendUserError,
        isLoadingSetUser: false,
      };

    case START_REG_BLOCK_CHAIN:
      return {
        ...state,
        blockChainError: '',
        isLoadingBlockChain: true,
      };

    case FETCH_REG_BLOCK_CHAIN_ERROR:
      // eslint-disable-next-line no-case-declarations
      let blockChainError = '';
      if (error) {
        blockChainError = i18n.t('errors.common.blockchain_error');
      }

      return {
        ...state,
        blockChainError,
      };

    case BLOCK_CHAIN_STOP_LOADER:
      return {
        ...state,
        isLoadingBlockChain: false,
      };

    case CLEAR_REG_ERRORS:
      return {
        ...state,
        sendPhoneError: '',
        sendVerifyError: '',
        sendUserError: '',
        blockChainError: '',
      };

    default:
      return state;
  }
}
