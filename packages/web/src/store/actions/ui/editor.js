import { SET_EDITOR_STATE } from 'store/constants';

// eslint-disable-next-line import/prefer-default-export
export function setEditorState({ mode, isInline = false }) {
  return {
    type: SET_EDITOR_STATE,
    payload: {
      mode: mode || null,
      isInline,
    },
  };
}
