import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { setAvatar, setCover, setName } from 'store/actions/local';

import CreateCommunityHeader from './CreateCommunityHeader';

export default connect(
  state => {
    const communityCreationState = dataSelector('createCommunity')(state);

    if (communityCreationState) {
      return {
        avatarUrl: communityCreationState.avatarUrl,
        coverUrl: communityCreationState.coverUrl,
        name: communityCreationState.name,
      };
    }

    return {
      avatarUrl: '',
      coverUrl: '',
      name: '',
    };
  },
  {
    setAvatar,
    setCover,
    setName,
  }
)(CreateCommunityHeader);
