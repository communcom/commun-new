import { Router } from 'shared/routes';
import { i18n } from 'shared/i18n';
import { normalizeCyberwayErrorMessage } from 'utils/errors';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { wait } from 'utils/time';
import { clearVotes, createAndApproveBanPostProposal } from 'store/actions/commun';
import { fetchPostBanProposal, waitForTransaction } from 'store/actions/gate';

export const clearAllVotes = ({ communityId }) => async dispatch => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await dispatch(clearVotes({ communityId }));
    } catch (err) {
      const normalizedError = normalizeCyberwayErrorMessage(err);

      if (normalizedError === 'no votes') {
        return null;
      }

      if (normalizedError === 'duplicate transaction') {
        // eslint-disable-next-line no-await-in-loop
        await wait(1000);
      } else {
        throw err;
      }
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

      displaySuccess(i18n.t('toastsMessages.proposal.created'));
      Router.pushRoute('leaderboard', { community: post.contentId.communityId });
    } catch (err) {
      displayError(err);
    }
  }
};
