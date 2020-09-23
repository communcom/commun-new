import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';

import ManageCommunityMobileWidget from './ManageCommunityMobileWidget';

export default connect(null, {
  openModal,
})(ManageCommunityMobileWidget);
