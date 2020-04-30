/* eslint-disable no-param-reassign */
import {
  FETCH_DONATIONS,
  FETCH_DONATIONS_SUCCESS,
  FETCH_DONATIONS_ERROR,
  FETCH_POST_DONATIONS,
  FETCH_POST_DONATIONS_SUCCESS,
  FETCH_POST_DONATIONS_ERROR,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { donationSchema } from 'store/schemas/gate';

export const fetchPostDonations = contentId => dispatch => {
  const params = {
    userId: contentId.userId,
    permlink: contentId.permlink,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_POST_DONATIONS, FETCH_POST_DONATIONS_SUCCESS, FETCH_POST_DONATIONS_ERROR],
      method: 'wallet.getDonations',
      params,
      schema: donationSchema,
    },
    meta: {
      contentId,
    },
  });
};

export const fetchDonations = posts => dispatch => {
  const params = {
    posts: posts.map(({ userId, permlink }) => ({ userId, permlink })),
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_DONATIONS, FETCH_DONATIONS_SUCCESS, FETCH_DONATIONS_ERROR],
      method: 'wallet.getDonationsBulk',
      params,
      schema: {
        items: [donationSchema],
      },
    },
    meta: {
      params,
    },
  });
};
