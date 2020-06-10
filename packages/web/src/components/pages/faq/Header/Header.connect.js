import { connect } from 'react-redux';

import { screenTypeDown } from 'store/selectors/ui';

import Header from './Header';

export default connect(state => ({
  isMobile: screenTypeDown.mobileLandscape(state),
}))(Header);
