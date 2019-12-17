import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { isAuthorizedSelector } from 'store/selectors/auth';

import AuthGuard from './AuthGuard';

export default connect(state => ({
  isAutoLogging: dataSelector(['auth', 'isAutoLogging'])(state),
  isAuthorized: isAuthorizedSelector(state),
}))(AuthGuard);
