import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { restoreData } from 'store/actions/local';
import { fetchUsersCommunities, getCommunity } from 'store/actions/gate';

import CreateCommunity from './CreateCommunity';

export default connect(
  createSelector(
    [isAuthorizedSelector, dataSelector('createCommunity')],
    (isAuthorized, communityCreationState) => ({
      isAuthorized,
      communityCreationState,
    })
  ),
  {
    restoreData,
    fetchUsersCommunities,
    getCommunity,
  }
)(CreateCommunity);
