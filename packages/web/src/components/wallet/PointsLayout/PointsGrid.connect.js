import { connect } from 'react-redux';

import { userCommunPointSelector } from 'store/selectors/wallet';

import PointsGrid from './PointsGrid';

export default connect(state => ({
  communBalance: Math.round(userCommunPointSelector(state).balance),
}))(PointsGrid);
