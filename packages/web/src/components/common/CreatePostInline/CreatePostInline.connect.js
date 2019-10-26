import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/common';

import CreatePostInline from './CreatePostInline';

export default connect(state => {
  const screenType = uiSelector(['mode', 'screenType'])(state);

  return {
    dontScroll: screenType === 'mobile',
    isDesktop: screenType === 'desktop',
  };
})(CreatePostInline);
