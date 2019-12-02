export const UIModeSelector = modeName => state => state.ui.mode[modeName];

export const retinaSuffixSelector = state => (state.ui.mode.isRetina ? '@2' : '');
