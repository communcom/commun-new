import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';

import Header from './Header';

export default connect(state => ({
  isDesktop: modeSelector(state).screenType === 'desktop',
}))(Header);
