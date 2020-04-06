import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { setLanguage, setDescription } from 'store/actions/local';

import CreateDescription from './CreateDescription';

export default connect(
  state => {
    const communityCreationState = dataSelector('createCommunity')(state);

    if (communityCreationState) {
      return {
        language: communityCreationState.language,
        description: communityCreationState.description,
      };
    }

    return {
      language: null,
      description: '',
    };
  },
  {
    setLanguage,
    setDescription,
  }
)(CreateDescription);
