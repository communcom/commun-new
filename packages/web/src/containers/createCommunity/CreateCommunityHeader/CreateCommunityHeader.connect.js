import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { userCommunPointSelector } from 'store/selectors/wallet';
import { setAvatar, setCover, setName } from 'store/actions/local';
import { fetchUsersCommunities } from 'store/actions/gate';
import { createCommunity, restoreCommunityCreation } from 'store/actions/complex';
import {
  openNotEnoughCommunsModal,
  openCreateCommunityConfirmationModal,
} from 'store/actions/modals';

import CreateCommunityHeader from './CreateCommunityHeader';

export default connect(
  state => {
    const communityCreationState = dataSelector('createCommunity')(state);
    const { balance } = userCommunPointSelector(state);

    return {
      avatarUrl: communityCreationState.avatarUrl,
      coverUrl: communityCreationState.coverUrl,
      name: communityCreationState.name,
      communBalance: parseFloat(balance),
    };
  },
  {
    setAvatar,
    setCover,
    setName,
    fetchUsersCommunities,
    createCommunity,
    restoreCommunityCreation,
    openCreateCommunityConfirmationModal,
    openNotEnoughCommunsModal,
  }
)(CreateCommunityHeader);
