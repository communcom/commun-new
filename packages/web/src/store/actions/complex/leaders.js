import { Router } from 'shared/routes';
import { normalizeCyberwayErrorMessage } from 'utils/errors';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { clearVotes, createAndApproveBanPostProposal } from 'store/actions/commun';
import { fetchPostBanProposal, waitForTransaction } from 'store/actions/gate';

export const clearAllVotes = ({ communityId }) => async dispatch => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await dispatch(clearVotes({ communityId }));
    } catch (err) {
      const error = normalizeCyberwayErrorMessage(err);
      if (error === 'no votes') {
        return null;
      }
      throw err;
    }
  }
};

export const createBanPostProposalIfNeeded = post => async dispatch => {
  let proposal;

  try {
    proposal = await dispatch(fetchPostBanProposal(post.contentId));
  } catch (err) {
    if (err.code !== 404) {
      displayError(err);
      return;
    }
  }

  if (!proposal) {
    try {
      const result = await dispatch(createAndApproveBanPostProposal(post.contentId));

      await dispatch(waitForTransaction(result.transaction_id));

      displaySuccess('Proposal created');
      Router.pushRoute('leaderboard', { community: post.contentId.communityId });
    } catch (err) {
      displayError(err);
    }
  }
};
