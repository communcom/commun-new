import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { openModalEditor } from 'store/actions/modals';
// import { uiSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

import WhatsNewOpener from './WhatsNewOpener';

export default connect(
  createSelector(
    [currentUnsafeUserIdSelector, dataSelector('config')],
    (loggedUserId, { isMaintenance }) => ({
      // isMobile: uiSelector(['mode', 'screenType'])(state) === 'mobile',
      loggedUserId,
      isMaintenance,
    })
  ),
  {
    openModalEditor,
  }
)(WhatsNewOpener);
