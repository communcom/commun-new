import { connect } from 'react-redux';

import { createCommunity, restoreCommunityCreation } from 'store/actions/complex';
import { fetchUsersCommunities } from 'store/actions/gate';
import { openCreateCommunityConfirmationModal } from 'store/actions/modals';
import { dataSelector } from 'store/selectors/common';

import Information from './Information';

export default connect(
  state => {
    const communityCreationState = dataSelector('createCommunity')(state);

    return {
      name: communityCreationState.name,
    };
  },
  {
    fetchUsersCommunities,
    createCommunity,
    restoreCommunityCreation,
    openCreateCommunityConfirmationModal,
  }
)(Information);
