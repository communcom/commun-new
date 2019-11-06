import { connect } from 'react-redux';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import WhatsNewOpener from './WhatsNewOpener';

export default connect(state => ({
  loggedUserId: currentUnsafeUserIdSelector(state),
}))(WhatsNewOpener);
