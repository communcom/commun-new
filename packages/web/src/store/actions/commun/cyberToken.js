import { openModal } from 'redux-modals-manager';

import { COMMUN_API } from 'store/middlewares/commun-api';

import {
  TRANSFER_TOKEN,
  TRANSFER_TOKEN_SUCCESS,
  TRANSFER_TOKEN_ERROR,
} from 'store/constants/actionTypes';
import { MODAL_CANCEL, SHOW_MODAL_LOGIN } from 'store/constants/modalTypes';
import { currentUserIdSelector } from 'store/selectors/auth';

import { getBalance, getTransfersHistory /* waitForWalletTransaction */ } from 'store/actions/gate';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { asyncTimeout } from 'utils/common';

const CONTRACT_NAME = 'cyberToken';

// eslint-disable-next-line import/prefer-default-export
export const transferToken = (recipient, tokensQuantity, tokensType, memo) => async (
  dispatch,
  getState
) => {
  const loggedUserId = currentUserIdSelector(getState());

  if (!loggedUserId) {
    const result = await dispatch(openModal(SHOW_MODAL_LOGIN));
    if (result.status === MODAL_CANCEL) {
      return false;
    }
  }

  const data = {
    from: loggedUserId,
    to: recipient,
    quantity: `${parseFloat(tokensQuantity).toFixed(3)} ${tokensType}`,
    memo: memo || '',
  };

  try {
    await dispatch({
      [COMMUN_API]: {
        types: [TRANSFER_TOKEN, TRANSFER_TOKEN_SUCCESS, TRANSFER_TOKEN_ERROR],
        contract: CONTRACT_NAME,
        method: 'transfer',
        params: data,
      },
      meta: data,
    });

    // await dispatch(waitForWalletTransaction(processed?.id));
    // TODO: should be replaced with waitForTransaction method, balance update takes about 8-10 seconds
    await asyncTimeout(10000);
    await Promise.all([
      dispatch(getBalance(loggedUserId)),
      dispatch(getTransfersHistory(loggedUserId, { isIncoming: false })),
    ]);
    displaySuccess('Transfer is successful');
    return true;
  } catch (err) {
    displayError('Transfer is failed', err);
    return false;
  }
};
