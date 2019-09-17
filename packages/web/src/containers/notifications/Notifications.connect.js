import { connect } from 'react-redux';

import { fetchNotifications } from 'store/actions/gate/notifications';
import { statusSelector, dataSelector } from 'store/selectors/common';
import { isAuthorizedSelector } from 'store/selectors/auth';

import Notifications from './Notifications';

export default connect(
  state => {
    const data = dataSelector('notifications')(state);
    const status = statusSelector('notifications')(state);

    return {
      totalCount: data.totalCount,
      fetchError: status.error,
      order: status.order,
      lastId: status.lastId,
      isLoading: status.isLoading,
      isAllowLoadMore: !status.isLoading && !status.isEnd,
      isAuthorized: isAuthorizedSelector(state),
    };
  },
  {
    fetchNotifications,
  }
)(Notifications);
