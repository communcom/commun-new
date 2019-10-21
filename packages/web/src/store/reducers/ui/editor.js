import { OPEN_POST_EDITOR, CLOSE_POST_EDITOR } from 'store/constants';

const initialState = {
  isInlineEditorOpen: false,
  withPhoto: false,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case OPEN_POST_EDITOR:
      return {
        isInlineEditorOpen: true,
        withPhoto: payload.withPhoto,
      };

    case CLOSE_POST_EDITOR:
      return {
        isInlineEditorOpen: false,
        withPhoto: false,
      };

    default:
      return state;
  }
}
