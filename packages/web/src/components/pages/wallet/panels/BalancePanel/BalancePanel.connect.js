import { connect } from 'react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';

import BalancePanel from './BalancePanel';

export default connect(state => ({
  currentUser: currentUnsafeUserSelector(state)?.username,
}))(BalancePanel);
