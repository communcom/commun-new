import { connect } from 'react-redux';

import { pin } from 'store/actions/commun';
import { waitForTransaction } from 'store/actions/gate/content';
import { fetchProfile } from 'store/actions/gate/user';
import { entitySelector } from 'store/selectors/common';
import { extendedNotificationSelector } from 'store/selectors/notifications';
import { isDarkThemeSelector } from 'store/selectors/settings';

import Notification from './Notification';

export default connect(
  (state, props) => {
    const notification = extendedNotificationSelector(props.notificationId)(state);
    let user = null;

    if (notification?.user?.userId) {
      user = entitySelector('users', notification.user.userId)(state);
    }

    return {
      notification,
      user,
      isDark: isDarkThemeSelector(state),
    };
  },
  (dispatch, props) => ({
    // TODO: we should check isOnline props here because OnlineNotification component, which pass isOnline prop, uses this component, but initializes before fetchProfile and waitForTransaction functions
    pin: userId => dispatch(pin(userId)),
    fetchProfile: props.isOnline
      ? null
      : ({ userId, username }) => dispatch(fetchProfile({ userId, username })),
    waitForTransaction: props.isOnline
      ? null
      : transactionId => dispatch(waitForTransaction(transactionId)),
  })
)(Notification);
