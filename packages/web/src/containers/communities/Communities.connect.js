import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { modeSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import Communities from './Communities';

export default connect(
  createSelector(
    [
      (state, props) => isOwnerSelector(props.userId)(state, props),
      selectFeatureFlags,
      modeSelector,
    ],
    (isOwner, featureFlags, { screenType }) => ({
      isOwner,
      featureFlags,
      isMobile: screenType === 'mobile',
    })
  )
)(Communities);
