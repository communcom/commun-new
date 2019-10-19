import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { uiSelector } from 'store/selectors/common';

import PostCardFooter from './PostCardFooter';

export default connect(
  state => {
    const screenType = uiSelector(['mode', 'screenType'])(state);

    return {
      isMobile: screenType === 'mobile',
    };
  },
  {
    openModal,
  }
)(PostCardFooter);
