import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { uiSelector } from 'store/selectors/common';
import { openEditor } from 'store/actions/ui';

import TapBar from './TapBar';

export default connect(
  createSelector(
    [
      currentUnsafeUserSelector,
      selectFeatureFlags,
      state => uiSelector(['mode', 'screenType'])(state),
    ],
    (currentUser, featureFlags, screenType) => ({
      currentUser,
      featureFlags,
      isShowTabBar: screenType === 'mobile' || screenType === 'mobileLandscape',
    })
  ),
  {
    openEditor,
  }
)(TapBar);
