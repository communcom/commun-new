import { UPDATE_UI_MODE } from 'store/constants/actionTypes';

const initialState = {
  screenType: 'mobile',
  isRetina: false,
  isWebView: false,
  isOneColumnMode: true,
  isDragAndDrop: false,
  isHydration: true, // While SSR and first browser render this flag is true.
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_UI_MODE:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
