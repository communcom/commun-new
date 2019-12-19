import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { statusSelector } from 'store/selectors/common';
import {
  fetchNotifications,
  markAllAsViewed,
  markAllAsRead,
} from 'store/actions/gate/notifications';
import NotificationsWindow from './NotificationsWindow';

export default connect(
  createSelector(
    [statusSelector('notificationsTray')],
    status => ({
      fetchError: status.error,
      order: status.order,
      lastTimestamp: status.lastTimestamp,
      isLoading: status.isLoading,
      isEnd: status.isEnd,
      isAllowLoadMore: !status.isLoading && !status.isEnd,
    })
  ),
  {
    fetchNotifications,
    markAllAsViewed,
    markAllAsRead,
  }
)(NotificationsWindow);
