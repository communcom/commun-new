import { connect } from 'react-redux';

import { isAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

import AuthGuard from './AuthGuard';

export default connect(state => ({
  isAutoLogging: dataSelector(['auth', 'isAutoLogging'])(state),
  isAuthorized: isAuthorizedSelector(state),
}))(AuthGuard);
