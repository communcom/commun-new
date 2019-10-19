import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { statusSelector, dataSelector } from 'store/selectors/common';
import {
  fetchNotifications,
  markAllAsViewed,
  markAllAsRead,
} from 'store/actions/gate/notifications';
import NotificationsWindow from './NotificationsWindow';

export default connect(
  createSelector(
    [statusSelector('notifications'), dataSelector('notifications')],
    (status, data) => ({
      fetchError: status.error,
      order: status.order,
      lastId: status.lastId,
      isLoading: status.isLoading,
      isEnd: status.isEnd,
      isAllowLoadMore: !status.isLoading && !status.isEnd,
      unreadCount: data.unreadCount,
    })
  ),
  {
    fetchNotifications,
    markAllAsViewed,
    markAllAsRead,
  }
)(NotificationsWindow);
