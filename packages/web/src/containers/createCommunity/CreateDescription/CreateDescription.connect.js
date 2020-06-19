import { connect } from 'react-redux';

import { setDefaultRules, setDescription, setLanguage } from 'store/actions/local';
import { dataSelector, statusSelector } from 'store/selectors/common';

import CreateDescription from './CreateDescription';

export default connect(
  state => {
    const communityCreationState = dataSelector('createCommunity')(state);
    const { isRulesChanged } = statusSelector('createCommunity')(state);

    if (communityCreationState) {
      return {
        language: communityCreationState.language,
        description: communityCreationState.description,
        isRulesChanged,
      };
    }

    return {
      language: null,
      description: '',
      isRulesChanged,
    };
  },
  {
    setLanguage,
    setDescription,
    setDefaultRules,
  }
)(CreateDescription);
