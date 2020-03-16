import { CALL_GATE } from 'store/middlewares/gate-api';

import { GET_AIRDROP, GET_AIRDROP_SUCCESS, GET_AIRDROP_ERROR } from 'store/constants/actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const getAirdrop = ({ communityId }) => ({
  [CALL_GATE]: {
    types: [GET_AIRDROP, GET_AIRDROP_SUCCESS, GET_AIRDROP_ERROR],
    method: 'airdrops.getAirdrop',
    params: {
      communityId,
    },
  },
  meta: {
    communityId,
  },
});
