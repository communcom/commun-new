import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';

import PostCardFooter from './PostCardFooter';

export default connect(null, {
  openModal,
})(PostCardFooter);
