import { connect } from 'react-redux';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';
import { updateProfileMeta } from 'store/actions/commun';

import Onboarding from './Onboarding';

export default connect(
  state => {
    const currentUserId = currentUnsafeUserIdSelector(state);
    const profile = entitySelector('profiles', currentUserId)(state);

    return {
      currentUserId,
      profile,
    };
  },
  {
    updateProfileMeta,
  }
)(Onboarding);
