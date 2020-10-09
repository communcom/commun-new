import { connect } from 'react-redux';

import { setAvatar, setCover, setDescription, setLanguage, setName } from 'store/actions/local';
import { dataSelector } from 'store/selectors/common';

import Base from './Base';

export default connect(
  state => {
    const communityCreationState = dataSelector('createCommunity')(state);

    return {
      avatarUrl: communityCreationState.avatarUrl,
      coverUrl: communityCreationState.coverUrl,
      name: communityCreationState.name,
      description: communityCreationState.description,
      language: communityCreationState.language,
    };
  },
  {
    setAvatar,
    setCover,
    setName,
    setDescription,
    setLanguage,
  }
)(Base);
