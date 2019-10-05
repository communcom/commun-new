import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { openModal } from 'redux-modals-manager';

import { userCommunPointSelector } from 'store/selectors/wallet';

import TotalBalance from './TotalBalance';

export default connect(
  createSelector(
    [userCommunPointSelector],
    comunPoint => ({ comunBalance: comunPoint?.balance || '0' })
  ),
  {
    openModal,
  }
)(TotalBalance);
