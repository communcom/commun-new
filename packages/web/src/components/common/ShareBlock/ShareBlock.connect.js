import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/common';

import ShareBlock from './ShareBlock';

export default connect(state => {
  const mode = uiSelector('mode')(state);

  return {
    isMobile: mode.screenType === 'mobile',
  };
})(ShareBlock);
