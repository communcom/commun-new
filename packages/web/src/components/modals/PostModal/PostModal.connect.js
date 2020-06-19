import { connect } from 'react-redux';

import { formatContentId } from 'store/schemas/gate';
import { currentUserIdSelector } from 'store/selectors/auth';
import { extendedPostSelector } from 'store/selectors/common';

import PostModal from './PostModal';

export default connect((state, props) => ({
  currentUserId: currentUserIdSelector(state),
  post: extendedPostSelector(formatContentId(props.contentId))(state),
}))(PostModal);
