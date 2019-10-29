import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { isOwnerSelector } from 'store/selectors/user';
import Communities from './Communities';

export default connect(
  createSelector(
    [(state, props) => isOwnerSelector(props.userId)(state, props), selectFeatureFlags],
    (isOwner, featureFlags) => ({
      isOwner,
      featureFlags,
    })
  )
)(Communities);
