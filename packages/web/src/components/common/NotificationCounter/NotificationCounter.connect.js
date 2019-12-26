import { connect } from 'react-redux';

import { screenTypeDown } from 'store/selectors/ui';
import { dataSelector } from 'store/selectors/common';
import { getNotificationsStatus } from 'store/actions/gate/notifications';

import NotificationCounter from './NotificationCounter';

export default connect(
  state => ({
    unseenCount: dataSelector(['notifications', 'unseenCount'])(state),
    isMobile: screenTypeDown.mobileLandscape(state),
  }),
  {
    getNotificationsStatus,
  }
)(NotificationCounter);
