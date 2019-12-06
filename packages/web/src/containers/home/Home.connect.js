import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';

import Home from './Home';

export default connect(state => ({
  isDesktop: modeSelector(state).screenType === 'desktop',
}))(Home);
