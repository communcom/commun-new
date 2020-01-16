import { connect } from 'react-redux';

import { getNotificationsSettings, setNotificationsSettings } from 'store/actions/gate';

import NotificationsSettings from './NotificationsSettings';

export default connect(null, {
  getNotificationsSettings,
  setNotificationsSettings,
})(NotificationsSettings);
