import { openModal } from 'redux-modals-manager';

import {
  OPEN_IN_FEED_POST_EDITOR,
  CLOSE_IN_FEED_POST_EDITOR,
  SET_EDITOR_SLOT_STATUS,
  SHOW_MODAL_NEW_POST_EDITOR,
} from 'store/constants';
import { uiSelector } from 'store/selectors/common';

export const openEditor = ({ withPhoto = false } = {}) => (dispatch, getState) => {
  const state = getState();

  const isSlotActive = uiSelector(['editor', 'isEditorSlotActive'])(state);

  if (isSlotActive) {
    return dispatch({
      type: OPEN_IN_FEED_POST_EDITOR,
      payload: {
        withPhoto,
      },
    });
  }

  return dispatch(
    openModal(SHOW_MODAL_NEW_POST_EDITOR, {
      withPhoto,
    })
  );
};

export const closeInFeedEditor = () => ({
  type: CLOSE_IN_FEED_POST_EDITOR,
  payload: {},
});

export const setInFeedEditorSlotStatus = isActive => ({
  type: SET_EDITOR_SLOT_STATUS,
  payload: {
    isActive,
  },
});
