import { connect } from 'react-redux';

import { deleteComment } from 'store/actions/complex/content';
import { createFastEqualSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';

import Comment from './Comment';

export default connect(
  createFastEqualSelector(
    [
      (state, props) => {
        const comment = entitySelector('postComments', props.commentId)(state);
        const author = entitySelector('users', comment.contentId.userId)(state);
        const isOwner = isOwnerSelector(author.id)(state);

        return [comment, author, isOwner];
      },
      currentUserIdSelector,
    ],
    ([comment, author, isOwner], loggedUserId) => ({
      comment,
      author,
      isOwner,
      loggedUserId,
    })
  ),
  { deleteComment }
)(Comment);
