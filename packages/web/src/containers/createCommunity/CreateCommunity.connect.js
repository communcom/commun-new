import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchUsersCommunities, getCommunity } from 'store/actions/gate';
import { restoreData } from 'store/actions/local';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

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
