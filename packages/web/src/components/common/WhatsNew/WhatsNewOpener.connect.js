import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import WhatsNewOpener from './WhatsNewOpener';

export default connect(
  createSelector(
    [currentUnsafeUserIdSelector],
    loggedUserId => ({
      loggedUserId,
    })
  )
)(WhatsNewOpener);
