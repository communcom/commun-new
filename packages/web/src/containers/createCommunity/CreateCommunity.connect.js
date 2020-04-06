import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { userCommunPointSelector } from 'store/selectors/wallet';
import { restoreData } from 'store/actions/local';

import CreateCommunity from './CreateCommunity';

export default connect(
  createSelector(
    [isAuthorizedSelector, dataSelector('createCommunity'), userCommunPointSelector],
    (isAuthorized, communityCreationState, userCommunBalance) => ({
      isAuthorized,
      communityCreationState,
      communBalance: parseFloat(userCommunBalance.balance),
    })
  ),
  {
    restoreData,
  }
)(CreateCommunity);
