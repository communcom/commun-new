import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import PostCardFooter from './PostCardFooter';

export default connect(
  null,
  {
    openModal,
  }
)(PostCardFooter);
