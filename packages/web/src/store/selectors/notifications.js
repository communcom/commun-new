import { entitySelector } from 'store/selectors/common';

// eslint-disable-next-line import/prefer-default-export
export const extendedNotificationSelector = id => state => {
  let notification = entitySelector('notifications', id)(state);

  if (!notification) {
    return null;
  }

  notification = { ...notification };

  if (notification.community) {
    notification.community = entitySelector('communities', notification.community)(state);
  }

  if (notification.author) {
    notification.author = entitySelector('users', notification.author)(state);
  }

  if (notification.from) {
    notification.from = entitySelector('users', notification.from)(state);
  }

  if (notification.voter) {
    notification.voter = entitySelector('users', notification.voter)(state);
  }

  return notification;
};
