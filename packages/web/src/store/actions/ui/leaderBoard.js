/* eslint-disable import/prefer-default-export */

import {
  SELECT_COMMUNITY,
  CLEAR_COMMUNITY_FILTER,
  SET_SELECTED_COMMUNITIES,
} from 'store/constants';
import { uiSelector } from 'store/selectors/common';

export const SELECTED_COMMUNITIES_KEY = 'leaderBoard.selectedCommunities';

function saveToLocalStorage(state) {
  try {
    const communities = uiSelector(['leaderBoard', 'selectedCommunities'])(state);
    localStorage.setItem(SELECTED_COMMUNITIES_KEY, JSON.stringify(communities));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
  }
}

/**
 * @param {string} communityId
 * @param {'select','add','remove'} action
 */
export const selectCommunity = ({ communityId, action = 'select' }) => (dispatch, getState) => {
  setTimeout(() => {
    saveToLocalStorage(getState());
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
    saveToLocalStorage(getState());
  }, 0);

  return dispatch({
    type: CLEAR_COMMUNITY_FILTER,
    payload: {},
  });
};

export const loadSelectedCommunities = () => dispatch => {
  let communities = [];

  try {
    const json = localStorage.getItem(SELECTED_COMMUNITIES_KEY);

    if (json) {
      communities = JSON.parse(json);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
  }

  dispatch({
    type: SET_SELECTED_COMMUNITIES,
    payload: {
      communities,
    },
  });
};
