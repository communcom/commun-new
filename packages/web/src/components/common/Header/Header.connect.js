import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { uiSelector } from 'store/selectors/common';

import Header from './Header';

export default connect(
  createSelector(
    [state => uiSelector(['mode', 'screenType'])(state)],
    screenType => ({
      isHideHeader: screenType === 'mobile' || screenType === 'mobileLandscape',
    })
  )
)(Header);
