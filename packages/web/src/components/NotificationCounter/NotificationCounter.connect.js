import { connect } from 'react-redux';

import { uiSelector, dataSelector } from 'store/selectors/common';
import { getNotificationsCount } from 'store/actions/gate/notifications';

import NotificationCounter from './NotificationCounter';

export default connect(
  state => {
    const screenType = uiSelector(['mode', 'screenType'])(state);

    return {
      freshCount: dataSelector(['notifications', 'freshCount'])(state),
      isMobile: screenType === 'mobile' || screenType === 'mobileLandscape',
    };
  },
  {
    getNotificationsCount,
  }
)(NotificationCounter);
