import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { uiSelector } from 'store/selectors/common';

import FeedHeaderMobile from './FeedHeaderMobile';

export default connect(
  createSelector(
    [uiSelector(['mode', 'screenType'])],
    screenType => ({
      isShowHeader: screenType === 'mobile' || screenType === 'mobileLandscape',
    })
  )
)(FeedHeaderMobile);
