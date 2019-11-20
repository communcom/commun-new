/* eslint-disable import/prefer-default-export */

import { UPVOTE, DOWNVOTE } from 'shared/constants';
import { SET_POST_VOTE, SET_COMMENT_VOTE } from 'store/constants';
import { vote as communVote } from 'store/actions/commun/publish';
import { formatContentId } from 'store/schemas/gate';

export const vote = ({ action, type, contentId }) => async dispatch => {
  const voteResult = await dispatch(
    communVote(action, {
      commun_code: contentId.communityId,
      message_id: {
        author: contentId.userId,
        permlink: contentId.permlink,
      },
    })
  );

  dispatch({
    type: type === 'post' ? SET_POST_VOTE : SET_COMMENT_VOTE,
    payload: {
      id: formatContentId(contentId),
      votes: {
        hasUpVote: action === UPVOTE,
        hasDownVote: action === DOWNVOTE,
      },
    },
  });

  return voteResult;
};
