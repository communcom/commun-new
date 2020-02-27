import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { dataSelector, uiSelector } from 'store/selectors/common';
import { openModalEditor } from 'store/actions/modals';
import { openLoginModal } from 'store/actions/ui';

import TapBar from './TapBar';

export default connect(
  createSelector(
    [
      currentUnsafeUserSelector,
      selectFeatureFlags,
      dataSelector(['auth', 'isAutoLogging']),
      state => uiSelector(['mode', 'screenType'])(state),
    ],
    (currentUser, featureFlags, isAutoLogging, screenType) => ({
      currentUser: currentUser?.username,
      featureFlags,
      isAutoLogging,
      isShowTabBar: screenType === 'mobile' || screenType === 'mobileLandscape',
    })
  ),
  {
    openModalEditor,
    openLoginModal,
  }
)(TapBar);
