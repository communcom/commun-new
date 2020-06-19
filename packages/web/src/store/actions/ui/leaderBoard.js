/* eslint-disable import/prefer-default-export */

import {
  CLEAR_COMMUNITY_FILTER,
  SELECT_COMMUNITY,
  SET_SELECTED_COMMUNITIES,
} from 'store/constants';
import { uiSelector } from 'store/selectors/common';

export const SELECTED_COMMUNITIES_KEY = 'leaderBoard.selectedCommunities';

function saveSelectedCommunities(state) {
  if (window.sessionStorage) {
    try {
      const communities = uiSelector(['leaderBoard', 'selectedCommunities'])(state);
      window.sessionStorage.setItem(SELECTED_COMMUNITIES_KEY, JSON.stringify(communities));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }
}

/**
 * @param {string} communityId
 * @param {'select','add','remove'} action
 */
export const selectCommunity = ({ communityId, action = 'select' }) => (dispatch, getState) => {
  setTimeout(() => {
    saveSelectedCommunities(getState());
  }, 0);

  return dispatch({
    type: SELECT_COMMUNITY,
    payload: {
      communityId,
      action,
    },
  });
};

export const clearCommunityFilter = () => (dispatch, getState) => {
  setTimeout(() => {
    saveSelectedCommunities(getState());
  }, 0);

  return dispatch({
    type: CLEAR_COMMUNITY_FILTER,
    payload: {},
  });
};

export const loadSelectedCommunities = () => dispatch => {
  let communities = [];

  if (window.sessionStorage) {
    try {
      const json = window.sessionStorage.getItem(SELECTED_COMMUNITIES_KEY);

      if (json) {
        communities = JSON.parse(json);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  dispatch({
    type: SET_SELECTED_COMMUNITIES,
    payload: {
      communities,
    },
  });
};
