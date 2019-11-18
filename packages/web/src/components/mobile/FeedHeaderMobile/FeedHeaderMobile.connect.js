import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { uiSelector } from 'store/selectors/common';

import FeedHeaderMobile from './FeedHeaderMobile';

export default connect(
  createSelector(
    [state => uiSelector(['mode', 'screenType'])(state)],
    screenType => ({
      isShowHeader: screenType === 'mobile' || screenType === 'mobileLandscape',
    })
  )
)(FeedHeaderMobile);
