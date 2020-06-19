import { connect } from 'react-redux';

import { fetchNotifications } from 'store/actions/gate/notifications';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { statusSelector } from 'store/selectors/common';

import Notifications from './Notifications';

export default connect(
  state => {
    const status = statusSelector('notifications')(state);

    return {
      fetchError: status.error,
      order: status.order,
      lastTimestamp: status.lastTimestamp,
      isLoading: status.isLoading,
      isAllowLoadMore: !status.isLoading && !status.isEnd,
      isAuthorized: isAuthorizedSelector(state),
    };
  },
  {
    fetchNotifications,
  }
)(Notifications);
