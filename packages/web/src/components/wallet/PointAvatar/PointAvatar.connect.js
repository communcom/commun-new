import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';

import PointAvatar from './PointAvatar';

export default connect(state => {
  const userId = currentUserIdSelector(state);
  const profile = entitySelector('profiles', userId)(state);

  return {
    profileAvatarUrl: profile?.avatarUrl,
  };
})(PointAvatar);
