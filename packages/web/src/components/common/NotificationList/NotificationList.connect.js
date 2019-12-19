import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import NotificationList from './NotificationList';

export default connect((state, { order }) => {
  const orderWithDates = order.map(id => {
    const notification = entitySelector('notifications', id)(state);

    return {
      id,
      date: new Date(notification.timestamp).toDateString(),
    };
  });

  return {
    orderWithDates,
  };
})(NotificationList);
