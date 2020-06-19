import { connect } from 'react-redux';

import { updateCommunityRules } from 'store/actions/commun';
import { setRule } from 'store/actions/local';
import { openConfirmDialog } from 'store/actions/modals';

import RuleEditModal from './RuleEditModal';

export default connect(null, {
  openConfirmDialog,
  updateCommunityRules,
  setRule,
})(RuleEditModal);
