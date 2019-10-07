import { connect } from 'react-redux';

import { createFastEqualSelector, entitySelector, modeSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector, currentUnsafeUserEntitySelector } from 'store/selectors/auth';

import Header from './Header';

export default connect(
  createFastEqualSelector(
    [
      currentUnsafeUserSelector,
      currentUnsafeUserEntitySelector,
      (state, props) => {
        const { communityId } = props;

        if (!communityId) {
          return null;
        }

        return entitySelector('communities', communityId)(state);
      },
      modeSelector,
    ],
    (currentUser, user, community, mode) => ({
      currentUser,
      user,
      community,
      // TODO: replace with info from store
      communityColor: '#eea041',
      isDesktop: mode.screenType === 'desktop',
    })
  )
)(Header);
