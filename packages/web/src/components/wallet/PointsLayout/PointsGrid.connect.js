import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';
import { userCommunPointSelector } from 'store/selectors/wallet';

import PointsGrid from './PointsGrid';

export default connect(state => ({
  communBalance: Math.round(userCommunPointSelector(state).balance),
  isMobile: modeSelector(state).screenType === 'mobile',
}))(PointsGrid);
