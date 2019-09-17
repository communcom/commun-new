import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import PostCardBody from './PostCardBody';

export default connect(
  null,
  {
    openModal,
  }
)(PostCardBody);
