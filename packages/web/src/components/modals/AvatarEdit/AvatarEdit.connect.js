import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';
import { isDarkThemeSelector } from 'store/selectors/settings';
import { screenTypeDown } from 'store/selectors/ui';

import AvatarEdit from './AvatarEdit';

export default connect(state => {
  const { screenType } = modeSelector(state);
  let isMobile = false;

  if (screenType) {
    isMobile = screenTypeDown.mobileLandscape(state);
  }

  return {
    isMobile,
    isDark: isDarkThemeSelector(state),
  };
})(AvatarEdit);
