import { connect } from 'react-redux';

import { SHOW_MODAL_POST, SHOW_MODAL_POST_EDIT } from 'store/constants';
import { deletePost } from 'store/actions/complex';
import { extendedPostSelector } from 'store/selectors/common';
import { isNsfwShowSelector } from 'store/selectors/settings';
import { openModal } from 'store/actions/modals';

import PostCard from './PostCard';

export default connect(
  (state, props) => ({
    post: extendedPostSelector(props.postId)(state),
    isNsfwShow: isNsfwShowSelector(state),
  }),
  {
    openPost: contentId => openModal(SHOW_MODAL_POST, { contentId }),
    openPostEdit: contentId => openModal(SHOW_MODAL_POST_EDIT, { contentId }),
    deletePost,
  }
)(PostCard);
