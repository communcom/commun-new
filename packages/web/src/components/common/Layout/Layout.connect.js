import { connect } from 'react-redux';

import { screenTypeDown } from 'store/selectors/ui';
import { currentUserIdSelector } from 'store/selectors/auth';

import Layout from './Layout';

export default connect(state => ({
  isMobile: screenTypeDown.mobileLandscape(state),
  loggedUserId: currentUserIdSelector(state),
}))(Layout);
