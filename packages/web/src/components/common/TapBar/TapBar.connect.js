import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { openModal } from 'redux-modals-manager';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { SHOW_MODAL_LOGIN } from 'store/constants';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { uiSelector } from 'store/selectors/common';
import { openModalEditor } from 'store/actions/modals';

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
    openModalEditor,
    openLoginModal: () => openModal(SHOW_MODAL_LOGIN),
  }
)(TapBar);
