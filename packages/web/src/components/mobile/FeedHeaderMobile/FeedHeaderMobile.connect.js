import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_MOBILE_FEED_FILTERS } from 'store/constants';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { uiSelector } from 'store/selectors/common';

import FeedHeaderMobile from './FeedHeaderMobile';

export default connect(
  createSelector(
    [isAuthorizedSelector, uiSelector(['mode', 'screenType'])],
    (isAuthorized, screenType) => ({
      isAuthorized,
      isShowHeader: screenType === 'mobile' || screenType === 'mobileLandscape',
    })
  ),
  {
    openFiltersModal: params => openModal(SHOW_MODAL_MOBILE_FEED_FILTERS, { params }),
  }
)(FeedHeaderMobile);
