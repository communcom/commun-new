import { connect } from 'react-redux';
import { getAccountPermissions } from 'commun-client/lib/auth';
import isEmpty from 'ramda/src/isEmpty';
import { createSelector } from 'reselect';

import { changePassword, fetchAccountPermissions } from 'store/actions/commun/permissions';
import { currentUnsafeUserIdSelector, currentUnsafeUserSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

import ResetKeys from './ResetKeys';

export default connect(
  createSelector(
    [dataSelector(['chain', 'account']), currentUnsafeUserIdSelector, currentUnsafeUserSelector],
    (accountData, currentUserId, currentUser) => {
      let publicKeys = {};

      if (!isEmpty(accountData)) {
        publicKeys = getAccountPermissions(accountData.permissions);
      }

      const permissions = accountData?.permissions || null;

      return {
        currentUserId,
        currentUsername: currentUser?.username,
        publicKeys,
        permissions,
      };
    }
  ),
  {
    fetchAccountPermissions,
    changePassword,
  }
)(ResetKeys);
