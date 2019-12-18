const SCREEN_TYPES = ['mobile', 'mobileLandscape', 'tablet', 'desktop'];

export const UIModeSelector = modeName => state => state.ui.mode[modeName];

export const retinaSuffixSelector = state => (state.ui.mode.isRetina ? '@2' : '');

// screenTypeUp
export const screenTypeUp = upScreenType => state => {
  const { screenType } = state.ui.mode;

  return SCREEN_TYPES.indexOf(screenType) >= SCREEN_TYPES.indexOf(upScreenType);
};

screenTypeUp.mobileLandscape = screenTypeUp('mobileLandscape');
screenTypeUp.tablet = screenTypeUp('tablet');
screenTypeUp.desktop = screenTypeUp('desktop');

// screenTypeDown
export const screenTypeDown = downScreenType => state => {
  const { screenType } = state.ui.mode;

  return SCREEN_TYPES.indexOf(screenType) <= SCREEN_TYPES.indexOf(downScreenType);
};

screenTypeDown.mobileLandscape = screenTypeDown('mobileLandscape');
screenTypeDown.tablet = screenTypeDown('tablet');
screenTypeDown.desktop = screenTypeDown('desktop');
