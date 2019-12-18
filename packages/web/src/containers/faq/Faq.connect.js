import { connect } from 'react-redux';

import { screenTypeDown } from 'store/selectors/ui';

import Faq from './Faq';

export default connect(state => ({
  isMobile: screenTypeDown.mobileLandscape(state),
}))(Faq);
