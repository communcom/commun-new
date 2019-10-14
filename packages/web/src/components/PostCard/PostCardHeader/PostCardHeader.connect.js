import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';
import { createStructuredSelector } from 'reselect';

import { isOwnerSelector } from 'store/selectors/user';
import { report } from 'store/actions/complex/content';

import PostCardHeader from './PostCardHeader';

export default connect(
  createStructuredSelector({
    isOwner: (state, props) => isOwnerSelector(props.post.author.userId)(state),
  }),
  {
    openModal,
    report,
  }
)(PostCardHeader);
