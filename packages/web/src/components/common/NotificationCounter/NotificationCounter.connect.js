import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { screenTypeDown } from 'store/selectors/ui';

import NotificationCounter from './NotificationCounter';

export default connect(state => ({
  unseenCount: dataSelector(['notifications', 'unseenCount'])(state),
  isMobile: screenTypeDown.mobileLandscape(state),
}))(NotificationCounter);
