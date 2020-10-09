import { connect } from 'react-redux';

import { createCommunity, restoreCommunityCreation } from 'store/actions/complex';
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
    createCommunity,
    restoreCommunityCreation,
  }
)(Information);
