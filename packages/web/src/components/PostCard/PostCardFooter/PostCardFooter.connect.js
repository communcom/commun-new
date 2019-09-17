import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';
import { createStructuredSelector } from 'reselect';

import { isUnsafeAuthorizedSelector } from 'store/selectors/auth';

import PostCardFooter from './PostCardFooter';

export default connect(
  createStructuredSelector({
    isUnsafeAuthorized: isUnsafeAuthorizedSelector,
  }),
  {
    openModal,
  }
)(PostCardFooter);
