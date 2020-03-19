import { CALL_GATE } from 'store/middlewares/gate-api';

import { GET_AIRDROP, GET_AIRDROP_SUCCESS, GET_AIRDROP_ERROR } from 'store/constants/actionTypes';
import { getBalance } from 'store/actions/gate/wallet';

// eslint-disable-next-line import/prefer-default-export
export const getAirdrop = ({ communityId }) => async dispatch => {
  await dispatch({
    [CALL_GATE]: {
      types: [GET_AIRDROP, GET_AIRDROP_SUCCESS, GET_AIRDROP_ERROR],
      method: 'airdrop.getAirdrop',
      params: {
        communityId,
      },
    },
    meta: {
      communityId,
    },
  });

  setTimeout(() => {
    dispatch(getBalance()).catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
  }, 4000);
};
