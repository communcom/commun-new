import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';
import { createSelector } from 'reselect';

import { UIModeSelector } from 'store/selectors/ui';
import { blockUser, unblockUser, pin, unpin, updateProfileMeta } from 'store/actions/commun';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';
import { currentUserIdSelector } from 'store/selectors/auth';

import ProfileHeader from './ProfileHeader';

export default connect(
  createSelector(
    [state => UIModeSelector('screenType')(state), currentUserIdSelector],
    (screenType, loggedUserId) => ({
      loggedUserId,
      screenType,
    })
  ),
  {
    blockUser,
    unblockUser,
    pin,
    unpin,
    openModal,
    fetchProfile,
    waitForTransaction,
    updateProfileMeta,
  }
)(ProfileHeader);
