import { i18n } from 'shared/i18n';
import { Router } from 'shared/routes';
import { normalizeCyberwayErrorMessage } from 'utils/errors';
import { wait } from 'utils/time';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import {
  clearVotes,
  createAndApproveBanPostProposal,
  unVoteLeader,
  voteLeader,
} from 'store/actions/commun';
import { checkAuth } from 'store/actions/complex/auth';
import { fetchPostBanProposal, fetchVotedLeader, waitForTransaction } from 'store/actions/gate';
import { openConfirmDialog } from 'store/actions/modals/confirm';

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
  } else {
    // TODO: элегантное гибкое решение проблемы необновляющегося стейта кнопки создания пропозала из ленты
    displaySuccess(i18n.t('toastsMessages.proposal.created'));
  }
};

export const voteLeaderWithCheck = ({ communityId, leaderId }) => async dispatch => {
  const loggedUserId = await dispatch(checkAuth());
  const { leader } = await dispatch(fetchVotedLeader({ communityId, userId: loggedUserId }));

  if (!leader) {
    return dispatch(voteLeader({ communityId, leaderId }));
  }

  const isAllowRevote = await dispatch(
    openConfirmDialog(i18n.t('modals.confirm_dialog.revote_leader'), {
      confirmText: i18n.t('components.leader_row.vote'),
    })
  );

  if (isAllowRevote) {
    const { transaction_id: trxId } = await dispatch(
      unVoteLeader({ communityId, leaderId: leader.userId })
    );
    await dispatch(waitForTransaction(trxId));
    return dispatch(voteLeader({ communityId, leaderId }));
  }

  return null;
};
