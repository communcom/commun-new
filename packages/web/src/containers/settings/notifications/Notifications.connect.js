import { connect } from 'react-redux';

import { getNotificationsSettings, setNotificationsSettings } from 'store/actions/gate';

import Notifications from './Notifications';

export default connect(null, {
  getNotificationsSettings,
  setNotificationsSettings,
})(Notifications);
