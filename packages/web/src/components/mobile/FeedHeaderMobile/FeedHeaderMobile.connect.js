import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { uiSelector } from 'store/selectors/common';

import { isAuthorizedSelector } from 'store/selectors/auth';
import FeedHeaderMobile from './FeedHeaderMobile';

export default connect(
  createSelector(
    [isAuthorizedSelector, uiSelector(['mode', 'screenType'])],
    (isAuthorized, screenType) => ({
      isAuthorized,
      isShowHeader: screenType === 'mobile' || screenType === 'mobileLandscape',
    })
  )
)(FeedHeaderMobile);
