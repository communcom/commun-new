import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUnsafeUserSelector } from 'store/selectors/auth';

import WhatsNewOpener from './WhatsNewOpener';

export default connect(
  createSelector(
    [currentUnsafeUserSelector],
    currentUser => ({
      loggedUserId: currentUser?.userId,
    })
  )
)(WhatsNewOpener);
