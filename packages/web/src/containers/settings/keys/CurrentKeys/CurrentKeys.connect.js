import { connect } from 'react-redux';
import { getAccountPermissions } from 'commun-client/lib/auth';
import isEmpty from 'ramda/src/isEmpty';
import { createSelector } from 'reselect';

import { fetchAccountPermissions } from 'store/actions/commun/permissions';
import { openModal } from 'store/actions/modals';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

import CurrentKeys from './CurrentKeys';

export default connect(
  createSelector(
    [dataSelector(['chain', 'account']), currentUnsafeUserIdSelector],
    (accountData, currentUserId) => {
      let publicKeys = {};

      if (!isEmpty(accountData)) {
        publicKeys = getAccountPermissions(accountData.permissions);
      }
      return {
        currentUserId,
        publicKeys,
      };
    }
  ),
  {
    openModal,
    fetchAccountPermissions,
  }
)(CurrentKeys);
