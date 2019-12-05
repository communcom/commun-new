import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { screenTypeUp } from 'store/selectors/ui';

import CommentAvatar from './CommentAvatar';

export default connect(state => ({
  userId: currentUserIdSelector(state),
  isShow: screenTypeUp.tablet(state),
}))(CommentAvatar);
