import { connect } from 'react-redux';

import { screenTypeUp } from 'store/selectors/ui';

import AllResults from './AllResults';

export default connect(state => ({
  isMobile: !screenTypeUp.tablet(state),
}))(AllResults);
