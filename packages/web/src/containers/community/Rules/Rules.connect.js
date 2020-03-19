import { connect } from 'react-redux';

import { SHOW_MODAL_RULE_EDIT } from 'store/constants';
import { entitySelector } from 'store/selectors/common';
import { amILeaderSelector } from 'store/selectors/auth';
import { openModal } from 'store/actions/modals';

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
  }
)(Rules);
