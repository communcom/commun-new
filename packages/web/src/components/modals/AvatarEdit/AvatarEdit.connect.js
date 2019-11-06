import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';

import AvatarEdit from './AvatarEdit';

export default connect(state => {
  const { screenType } = modeSelector(state);
  let isMobile = false;

  if (screenType) {
    isMobile = screenType === 'mobile' || screenType === 'mobileLandscape';
  }

  return {
    isMobile,
  };
})(AvatarEdit);
