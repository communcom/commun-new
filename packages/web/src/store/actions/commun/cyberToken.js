import { COMMUN_SYMBOL, TOKEN_DECS } from 'shared/constants';
import { checkAuth } from 'store/actions/complex/auth';
import { OPEN_WALLET, OPEN_WALLET_ERROR, OPEN_WALLET_SUCCESS } from 'store/constants/actionTypes';
import { COMMUN_API } from 'store/middlewares/commun-api';

// eslint-disable-next-line import/prefer-default-export
export const openCommunWallet = () => async dispatch => {
  const loggedUserId = await dispatch(checkAuth());

  const data = {
    owner: loggedUserId,
    symbol: `${TOKEN_DECS},${COMMUN_SYMBOL}`,
    ram_payer: loggedUserId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [OPEN_WALLET, OPEN_WALLET_SUCCESS, OPEN_WALLET_ERROR],
      contract: 'cyberToken',
      method: 'open',
      params: data,
    },
    meta: {
      owner: loggedUserId,
    },
  });
};
