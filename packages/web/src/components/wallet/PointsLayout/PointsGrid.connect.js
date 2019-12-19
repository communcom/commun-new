import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';

import PointsGrid from './PointsGrid';

export default connect(state => ({
  isDesktop: modeSelector(state).screenType === 'desktop',
}))(PointsGrid);
