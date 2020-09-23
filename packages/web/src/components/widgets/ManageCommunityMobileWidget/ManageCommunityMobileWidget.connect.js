import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { selectCommunity } from 'store/actions/ui';

import ManageCommunityMobileWidget from './ManageCommunityMobileWidget';

export default connect(null, {
  selectCommunity,
  openModal,
})(ManageCommunityMobileWidget);
