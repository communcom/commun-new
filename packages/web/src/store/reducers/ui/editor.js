import { SET_EDITOR_STATE } from 'store/constants';

const initialState = {
  isOpen: false,
  isInline: false,
  mode: null,
};

export default function editor(state = initialState, { type, payload }) {
  switch (type) {
    case SET_EDITOR_STATE:
      return {
        isOpen: Boolean(payload.mode),
        isInline: Boolean(payload.isInline),
        mode: payload.mode,
      };

    default:
      return state;
  }
}
