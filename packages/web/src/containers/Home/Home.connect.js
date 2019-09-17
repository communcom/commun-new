import { connect } from 'react-redux';

import Home from './Home';

export default connect(state => ({
  isOneColumnMode: state.ui.mode.isOneColumnMode,
}))(Home);
