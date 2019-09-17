import { connect } from 'react-redux';

import { createDeepEqualSelector, entitySelector, modeSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector } from 'store/selectors/auth';

import Header from './Header';

export default connect(
  createDeepEqualSelector(
    [
      currentUnsafeUserSelector,
      (state, props) => {
        const { communityId } = props;

        if (!communityId) {
          return null;
        }

        return entitySelector('communities', communityId)(state);
      },
      modeSelector,
    ],
    (currentUser, community, mode) => ({
      currentUser,
      community,
      // TODO: replace with info from store
      communityColor: '#eea041',
      isDesktop: mode.screenType === 'desktop',
    })
  )
)(Header);
