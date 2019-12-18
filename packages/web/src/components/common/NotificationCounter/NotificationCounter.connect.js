import { connect } from 'react-redux';

import { screenTypeDown } from 'store/selectors/ui';
import { dataSelector } from 'store/selectors/common';
import { getNotificationsCount } from 'store/actions/gate/notifications';

import NotificationCounter from './NotificationCounter';

export default connect(
  state => ({
    freshCount: dataSelector(['notifications', 'freshCount'])(state),
    isMobile: screenTypeDown.mobileLandscape(state),
  }),
  {
    getNotificationsCount,
  }
)(NotificationCounter);
