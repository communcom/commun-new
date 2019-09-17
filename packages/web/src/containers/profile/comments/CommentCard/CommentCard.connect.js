import { connect } from 'react-redux';

import { createDeepEqualSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';

import CommentCard from './CommentCard';

export default connect(
  createDeepEqualSelector(
    [
      (state, props) => {
        const comment = entitySelector('profileComments', props.commentId)(state);
        const author = entitySelector('users', comment.author)(state);

        return [comment, author];
      },
      currentUserIdSelector,
    ],
    ([comment, author], loggedUserId) => ({
      comment,
      author,
      loggedUserId,
    })
  )
)(CommentCard);
