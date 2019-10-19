import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { markAsRead } from 'store/actions/gate/notifications';
import Notification from './Notification';

export default connect(
  (state, props) => ({
    notification: entitySelector('notifications', props.notificationId)(state),
  }),
  {
    markAsRead,
  }
)(Notification);
