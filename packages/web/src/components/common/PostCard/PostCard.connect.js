import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_POST, SHOW_MODAL_POST_EDIT } from 'store/constants';
import { deletePost } from 'store/actions/complex';
import { extendedPostSelector } from 'store/selectors/common';

import PostCard from './PostCard';

export default connect(
  (state, props) => ({
    post: extendedPostSelector(props.postId)(state),
  }),
  {
    openPost: contentId => openModal(SHOW_MODAL_POST, { contentId }),
    openPostEdit: contentId => openModal(SHOW_MODAL_POST_EDIT, { contentId }),
    deletePost,
  }
)(PostCard);
