import { connect } from 'react-redux';

import { extendedNotificationSelector } from 'store/selectors/notifications';

import Notification from './Notification';

export default connect((state, { notificationId }) => ({
  notification: extendedNotificationSelector(notificationId)(state),
}))(Notification);
