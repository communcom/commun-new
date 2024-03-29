import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';
import { screenTypeDown } from 'store/selectors/ui';

import EditAvatar from './EditAvatar';

export default connect(state => {
  const { screenType } = modeSelector(state);
  let isMobile = false;

  if (screenType) {
    isMobile = screenTypeDown.mobileLandscape(state);
  }

  return {
    isMobile,
  };
})(EditAvatar);
