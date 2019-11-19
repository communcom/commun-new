import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { openModalEditor } from 'store/actions/modals';

import WhatsNewOpener from './WhatsNewOpener';

export default connect(
  state => {
    const screenType = uiSelector(['mode', 'screenType'])(state);

    return {
      isMobile: screenType === 'mobile',
      loggedUserId: currentUnsafeUserIdSelector(state),
    };
  },
  {
    openModalEditor,
  }
)(WhatsNewOpener);
