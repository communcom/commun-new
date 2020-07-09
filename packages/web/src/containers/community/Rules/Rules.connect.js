import { connect } from 'react-redux';

import { updateCommunityRules } from 'store/actions/commun';
import { openConfirmDialog, openModal } from 'store/actions/modals';
import { SHOW_MODAL_RULE_EDIT } from 'store/constants';
import { amILeaderSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';

import Rules from './Rules';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);

    return {
      isLeader: amILeaderSelector(props.communityId)(state),
      rules: community.rules,
    };
  },
  {
    openRuleEditModal: ({ communityId, isNewRule, rule }) =>
      openModal(SHOW_MODAL_RULE_EDIT, { communityId, isNewRule, rule }),
    openConfirmDialog,
    updateCommunityRules,
  }
)(Rules);
