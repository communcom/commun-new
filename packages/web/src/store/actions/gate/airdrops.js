import { captureException } from 'utils/errors';
import { getBalance } from 'store/actions/gate/wallet';
import { GET_AIRDROP, GET_AIRDROP_ERROR, GET_AIRDROP_SUCCESS } from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';

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
      captureException(err);
    });
  }, 4000);
};
