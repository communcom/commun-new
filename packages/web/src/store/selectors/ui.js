const SCREEN_TYPES = ['mobileLandscape', 'tablet', 'desktop'];

export const UIModeSelector = modeName => state => state.ui.mode[modeName];

export const retinaSuffixSelector = state => (state.ui.mode.isRetina ? '@2' : '');

export const screenTypeUp = upScreenType => state => {
  const { screenType } = state.ui.mode;

  return SCREEN_TYPES.indexOf(upScreenType) >= SCREEN_TYPES.indexOf(screenType);
};

screenTypeUp.mobileLandscape = screenTypeUp('mobileLandscape');
screenTypeUp.tablet = screenTypeUp('tablet');
screenTypeUp.desktop = screenTypeUp('desktop');
