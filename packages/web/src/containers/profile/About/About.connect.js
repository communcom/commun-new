import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { clearCommunityFilter } from 'store/actions/ui';
import { entitySelector } from 'store/selectors/common';
import { screenTypeUp } from 'store/selectors/ui';
import { isOwnerSelector } from 'store/selectors/user';

import About from './About';

export default connect(
  createSelector(
    [
      (state, props) => entitySelector('profiles', props.userId)(state),
      (state, props) => isOwnerSelector(props.userId)(state),
      screenTypeUp.desktop,
    ],
    (profile, isOwner, isDesktop) => ({
      profile,
      isOwner,
      isDesktop,
    })
  ),
  {
    clearCommunityFilter,
  }
)(About);
