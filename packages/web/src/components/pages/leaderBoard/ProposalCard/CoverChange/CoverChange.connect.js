import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/common';

import CoverChange from './CoverChange';

export default connect(state => ({
  screenType: uiSelector(['mode', 'screenType'])(state),
}))(CoverChange);
