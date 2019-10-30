import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { openEditor } from 'store/actions/ui';

import TapBar from './TapBar';

export default connect(
  createSelector(
    [currentUnsafeUserSelector, selectFeatureFlags],
    (currentUser, featureFlags) => ({
      currentUser,
      featureFlags,
    })
  ),
  {
    openEditor,
  }
)(TapBar);
