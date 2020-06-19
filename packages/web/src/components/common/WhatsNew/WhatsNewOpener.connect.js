import { connect } from 'react-redux';

import { openModalEditor } from 'store/actions/modals';
// import { uiSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import WhatsNewOpener from './WhatsNewOpener';

export default connect(
  state => ({
    // isMobile: uiSelector(['mode', 'screenType'])(state) === 'mobile',
    loggedUserId: currentUnsafeUserIdSelector(state),
  }),
  {
    openModalEditor,
  }
)(WhatsNewOpener);
