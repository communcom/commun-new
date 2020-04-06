import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { SHOW_MODAL_RULE_EDIT } from 'store/constants';
import { openModal } from 'store/actions/modals';
import { removeRule } from 'store/actions/local';

import CreateRules from './CreateRules';

export default connect(
  state => {
    const communityCreationState = dataSelector('createCommunity')(state);

    if (communityCreationState) {
      return {
        rules: communityCreationState.rules,
      };
    }

    return {
      language: null,
      description: '',
    };
  },
  {
    openRuleEditModal: ({ isNewRule, rule, isCommunityCreation }) =>
      openModal(SHOW_MODAL_RULE_EDIT, { isNewRule, rule, isCommunityCreation }),
    removeRule,
  }
)(CreateRules);
