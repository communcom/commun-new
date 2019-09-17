import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { isAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector, statusSelector } from 'store/selectors/common';

import Wallet from './Wallet';

export default connect(
  createSelector(
    [isAuthorizedSelector, dataSelector(['auth', 'isAutoLogging']), statusSelector('wallet')],
    (isAuthorized, isAutoLogging, { isLoading }) => ({
      isAuthorized,
      isAutoLogging,
      isLoading,
    })
  )
)(Wallet);
