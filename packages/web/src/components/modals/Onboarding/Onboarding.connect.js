import { connect } from 'react-redux';

import { updateProfileMeta } from 'store/actions/commun';
import { fetchProfile } from 'store/actions/gate/user';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';

import Onboarding from './Onboarding';

export default connect(
  state => {
    const user = currentUnsafeUserSelector(state);
    let profile;

    if (user) {
      const { userId: currentUserId } = user;
      profile = entitySelector('profiles', currentUserId)(state);
    }

    return {
      user,
      profile,
    };
  },
  {
    updateProfileMeta,
    fetchProfile,
  }
)(Onboarding);
