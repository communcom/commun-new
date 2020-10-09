import { connect } from 'react-redux';

import { updateCommunityRules } from 'store/actions/commun';
import { removeRule, setDefaultRules, setRule } from 'store/actions/local';
import { openConfirmDialog, openModal } from 'store/actions/modals';
import { SHOW_MODAL_RULE_EDIT } from 'store/constants';
import { amILeaderSelector } from 'store/selectors/auth';
import { dataSelector, entitySelector, modeSelector } from 'store/selectors/common';

import Rules from './Rules';

export default connect(
  (state, props) => {
    let rules = [];
    let language = null;
    let isLeader = false;

    if (props.communityId) {
      const community = entitySelector('communities', props.communityId)(state);
      ({ rules } = community);
      isLeader = amILeaderSelector(props.communityId)(state);
    } else if (props.isCommunityCreation) {
      const communityCreationState = dataSelector('createCommunity')(state);

      if (communityCreationState) {
        ({ rules, language } = communityCreationState);
      }
      isLeader = true;
    }

    return {
      rules,
      language,
      isLeader,
      isMobile: modeSelector(state).screenType === 'mobile',
    };
  },
  {
    openRuleEditModal: ({ communityId, isNewRule, isCommunityCreation, rule }) =>
      openModal(SHOW_MODAL_RULE_EDIT, { communityId, isNewRule, isCommunityCreation, rule }),
    openConfirmDialog,
    updateCommunityRules,
    setRule,
    removeRule,
    setDefaultRules,
  }
)(Rules);
