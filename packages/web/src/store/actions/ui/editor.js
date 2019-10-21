/* eslint-disable import/prefer-default-export */

import { OPEN_POST_EDITOR, CLOSE_POST_EDITOR } from 'store/constants';

export const openEditor = ({ withPhoto = false } = {}) => ({
  type: OPEN_POST_EDITOR,
  payload: {
    withPhoto,
  },
});

export const closeEditor = () => ({
  type: CLOSE_POST_EDITOR,
  payload: {},
});
