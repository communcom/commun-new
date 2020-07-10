import { connect } from 'react-redux';

import { LANGUAGES } from 'shared/constants';
import { updateCommunityRules } from 'store/actions/commun';
import { openConfirmDialog, openModal } from 'store/actions/modals';
import { SHOW_MODAL_COMMUNITY_LANGUAGE_EDIT, SHOW_MODAL_RULE_EDIT } from 'store/constants';
import { amILeaderSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';

import Rules from './Rules';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);

    const language = LANGUAGES.find(item => item.code === community.language.toUpperCase());

    return {
      isLeader: amILeaderSelector(props.communityId)(state),
      rules: community.rules,
      language,
    };
  },
  {
    openRuleEditModal: ({ communityId, isNewRule, rule }) =>
      openModal(SHOW_MODAL_RULE_EDIT, { communityId, isNewRule, rule }),
    openCommunityLanguageEditModal: ({ communityId }) =>
      openModal(SHOW_MODAL_COMMUNITY_LANGUAGE_EDIT, { communityId }),
    openConfirmDialog,
    updateCommunityRules,
  }
)(Rules);
