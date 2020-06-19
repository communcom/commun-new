import { connect } from 'react-redux';

import { setCommunityInfo } from 'store/actions/commun';
import { openConfirmDialog } from 'store/actions/modals';

import DescriptionEditModal from './DescriptionEditModal';

export default connect(null, {
  openConfirmDialog,
  setCommunityInfo,
})(DescriptionEditModal);
