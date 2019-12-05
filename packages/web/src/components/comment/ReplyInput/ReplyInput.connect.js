import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';

import ReplyInput from './ReplyInput';

export default connect((state, props) => {
  const { parentComment } = props;

  const loggedUserId = currentUserIdSelector(state);

  const replyToCommentId = parentComment.contentId;
  const rootParentCommentId = parentComment.parents.comment || parentComment.contentId;

  return {
    loggedUserId,
    replyToCommentId,
    rootParentCommentId,
    isOwner: parentComment.contentId.userId === loggedUserId,
  };
})(ReplyInput);
