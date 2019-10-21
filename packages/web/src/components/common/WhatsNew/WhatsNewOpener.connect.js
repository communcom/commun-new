import { connect } from 'react-redux';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { openEditor } from 'store/actions/ui';

import WhatsNewOpener from './WhatsNewOpener';

export default connect(
  state => ({
    loggedUserId: currentUnsafeUserIdSelector(state),
  }),
  {
    openEditor,
  }
)(WhatsNewOpener);
