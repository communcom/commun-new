import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';

import Content from './Content';

export default connect(state => ({
  isDesktop: modeSelector(state).screenType === 'desktop',
}))(Content);
