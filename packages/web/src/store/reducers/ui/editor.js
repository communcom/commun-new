import {
  OPEN_IN_FEED_POST_EDITOR,
  CLOSE_IN_FEED_POST_EDITOR,
  SET_EDITOR_SLOT_STATUS,
} from 'store/constants';

const initialState = {
  isEditorSlotActive: false,
  isInlineEditorOpen: false,
  withPhoto: false,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case OPEN_IN_FEED_POST_EDITOR:
      return {
        ...state,
        isInlineEditorOpen: true,
        withPhoto: payload.withPhoto,
      };

    case CLOSE_IN_FEED_POST_EDITOR:
      return {
        ...state,
        isInlineEditorOpen: false,
        withPhoto: false,
      };

    case SET_EDITOR_SLOT_STATUS:
      return {
        ...state,
        isEditorSlotActive: payload.isActive,
      };

    default:
      return state;
  }
}
