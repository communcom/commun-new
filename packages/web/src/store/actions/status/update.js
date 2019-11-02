/* eslint-disable import/prefer-default-export */

import { CLEAR_LEADER_BOARD_STATUS } from 'store/constants';

// TODO: Rename in future
export const clearLeaderBoard = () => ({
  type: CLEAR_LEADER_BOARD_STATUS,
  payload: {},
});
