import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';
import { createStructuredSelector } from 'reselect';

import { isOwnerSelector } from 'store/selectors/user';

import PostCardHeader from './PostCardHeader';

export default connect(
  createStructuredSelector({
    isOwner: (state, props) => isOwnerSelector(props.post.author.userId)(state),
  }),
  {
    openModal,
  }
)(PostCardHeader);
