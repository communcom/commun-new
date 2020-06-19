import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import { openLoginModal, openModalEditor } from 'store/actions/modals';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { dataSelector, uiSelector } from 'store/selectors/common';

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
      isShowTapBar: screenType === 'mobile' || screenType === 'mobileLandscape',
    })
  ),
  {
    openModalEditor,
    openLoginModal,
  }
)(TapBar);
