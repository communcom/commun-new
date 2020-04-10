import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { userCommunPointSelector } from 'store/selectors/wallet';
import { transfer } from 'store/actions/commun';
import { setAvatar, setCover, setName, removeData } from 'store/actions/local';
import {
  createNewCommunity,
  setCommunitySettings,
  startCommunityCreation,
  fetchCommunity,
  waitForTransaction,
  getCommunity,
  fetchUsersCommunities,
} from 'store/actions/gate';
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
      communityCreationState,
      communBalance: parseFloat(balance),
    };
  },
  {
    setAvatar,
    setCover,
    setName,
    removeData,
    transfer,
    fetchCommunity,
    getCommunity,
    fetchUsersCommunities,
    waitForTransaction,
    createNewCommunity,
    setCommunitySettings,
    startCommunityCreation,
    openCreateCommunityConfirmationModal,
    openNotEnoughCommunsModal,
  }
)(CreateCommunityHeader);
