import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { blockUser, pin, unblockUser, unpin, updateProfileMeta } from 'store/actions/commun';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';
import { openModal } from 'store/actions/modals';
import { currentUserIdSelector } from 'store/selectors/auth';
import { screenTypeDown } from 'store/selectors/ui';

import ProfileHeader from './ProfileHeader';

export default connect(
  createSelector(
    [screenTypeDown.mobileLandscape, currentUserIdSelector],
    (isMobile, loggedUserId) => ({
      isMobile,
      loggedUserId,
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
