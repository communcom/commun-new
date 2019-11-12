import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import CoverAvatar from './CoverAvatar';

export default connect(
  null,
  {
    openModal,
  }
)(CoverAvatar);
