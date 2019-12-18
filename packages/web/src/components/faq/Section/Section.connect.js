import { connect } from 'react-redux';

import { screenTypeDown } from 'store/selectors/ui';

import Section from './Section';

export default connect(state => ({
  isMobile: screenTypeDown.mobileLandscape(state),
}))(Section);
