import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_RULE_EDIT } from 'store/constants';
import { entitySelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import Rules from './Rules';

export default connect(
  (state, props) => {
    const userId = currentUnsafeUserIdSelector(state);
    const profile = entitySelector('profiles', userId)(state);
    const community = entitySelector('communities', props.communityId)(state);

    return {
      isLeader: profile ? profile.leaderIn.includes(props.communityId) : true,
      rules: community.rules,
    };
  },
  {
    openRuleEditModal: ({ communityId, isNewRule, rule }) =>
      openModal(SHOW_MODAL_RULE_EDIT, { communityId, isNewRule, rule }),
  }
)(Rules);
