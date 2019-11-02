/* eslint-disable import/prefer-default-export */

import {
  SELECT_COMMUNITY,
  SELECT_ALL_COMMUNITIES,
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

export const selectCommunity = (communityId, isSelected) => (dispatch, getState) => {
  setTimeout(() => {
    saveToLocalStorage(getState());
  }, 0);

  return dispatch({
    type: SELECT_COMMUNITY,
    payload: {
      communityId,
      isSelected,
    },
  });
};

export const selectAllCommunities = isSelected => (dispatch, getState) => {
  setTimeout(() => {
    saveToLocalStorage(getState());
  }, 0);

  return dispatch({
    type: SELECT_ALL_COMMUNITIES,
    payload: {
      isSelected,
    },
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
