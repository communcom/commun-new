import { connect } from 'react-redux';

import { openConfirmDialog } from 'store/actions/modals';
import { setCommunityInfo } from 'store/actions/commun';

import DescriptionEditModal from './DescriptionEditModal';

export default connect(
  null,
  {
    openConfirmDialog,
    setCommunityInfo,
  }
)(DescriptionEditModal);
