import { COMMUN_API } from 'store/middlewares/commun-api';
import { checkAuth } from 'store/actions/complex/auth';
import { entitySelector } from 'store/selectors/common';

import {
  APPROVE_PROPOSAL,
  APPROVE_PROPOSAL_SUCCESS,
  APPROVE_PROPOSAL_ERROR,
  EXEC_PROPOSAL,
  EXEC_PROPOSAL_SUCCESS,
  EXEC_PROPOSAL_ERROR,
  CANCEL_PROPOSAL,
  CANCEL_PROPOSAL_SUCCESS,
  CANCEL_PROPOSAL_ERROR,
  CANCEL_PROPOSAL_APPROVE,
  CANCEL_PROPOSAL_APPROVE_SUCCESS,
  CANCEL_PROPOSAL_APPROVE_ERROR,
  SET_BAN_POST_PROPOSAL,
} from 'store/constants';
import { formatContentId, formatProposalId } from 'store/schemas/gate';

export const DEFAULT_PROPOSAL_EXPIRES = 2592000; // в секундах (2592000 = 30 суток)

export function generateRandomProposalId(prefix = 'pr') {
  const numbers = [];

  for (let i = 0; i < 12 - prefix.length; i += 1) {
    numbers.push(Math.floor(Math.random() * 5 + 1));
  }

  return `${prefix}${numbers.join('')}`;
}

export const createCommunityProposal = ({
  communityId,
  trx,
  permission = 'lead.smajor',
}) => async dispatch => {
  const userId = await dispatch(checkAuth());

  const data = {
    commun_code: communityId,
    proposer: userId,
    proposal_name: generateRandomProposalId(),
    permission,
    trx,
  };

  const results = await dispatch({
    [COMMUN_API]: {
      contract: 'ctrl',
      method: 'propose',
      params: data,
    },
  });

  return {
    transaction_id: results.transaction_id,
    communityId,
    proposer: data.proposer,
    proposalId: data.proposal_name,
  };
};

export const setCommunityInfo = ({ communityId, updates }) => async (dispatch, getState) => {
  const state = getState();

  const { issuer } = entitySelector('communities', communityId)(state);

  const data = {
    commun_code: communityId,
    description: updates.description || null,
    language: null,
    rules: updates.rules || null,
    avatar_image: updates.avatarUrl || null,
    cover_image: updates.coverUrl || null,
    subject: updates.subject || null,
  };

  const trx = await dispatch({
    [COMMUN_API]: {
      contract: 'list',
      method: 'setinfo',
      params: data,
      auth: {
        actor: issuer,
        permission: 'active',
      },
      options: {
        msig: true,
        raw: true,
        msigExpires: DEFAULT_PROPOSAL_EXPIRES,
      },
    },
  });

  return dispatch(createCommunityProposal({ communityId, trx }));
};

export const updateCommunityRules = ({ communityId, action }) =>
  setCommunityInfo({
    communityId,
    updates: {
      rules: JSON.stringify({
        type: 'patch',
        actions: [action],
      }),
    },
  });

function makeProposalAction(action, types, isCancel) {
  return ({ communityId, proposer, proposalId }) => async dispatch => {
    const userId = await dispatch(checkAuth());

    const params = {
      proposer,
      proposal_name: proposalId,
    };

    if (isCancel) {
      params.canceler = userId;
    } else {
      params.approver = userId;
    }

    return dispatch({
      [COMMUN_API]: {
        types,
        contract: 'ctrl',
        method: action,
        params,
      },
      meta: {
        proposer,
        proposalId,
        communityId,
      },
    });
  };
}

export const approveProposal = makeProposalAction('approve', [
  APPROVE_PROPOSAL,
  APPROVE_PROPOSAL_SUCCESS,
  APPROVE_PROPOSAL_ERROR,
]);

export const cancelProposalApprove = makeProposalAction('unapprove', [
  CANCEL_PROPOSAL_APPROVE,
  CANCEL_PROPOSAL_APPROVE_SUCCESS,
  CANCEL_PROPOSAL_APPROVE_ERROR,
]);

export const cancelProposal = makeProposalAction(
  'cancel',
  [CANCEL_PROPOSAL, CANCEL_PROPOSAL_SUCCESS, CANCEL_PROPOSAL_ERROR],
  true
);

export const execProposal = ({ communityId, proposer, proposalId }) => async dispatch => {
  const userId = await dispatch(checkAuth());

  return dispatch({
    [COMMUN_API]: {
      types: [EXEC_PROPOSAL, EXEC_PROPOSAL_SUCCESS, EXEC_PROPOSAL_ERROR],
      contract: 'ctrl',
      method: 'exec',
      params: {
        proposer,
        proposal_name: proposalId,
        executer: userId,
      },
    },
    meta: {
      proposer,
      proposalId,
      communityId,
    },
  });
};

export const createAndApproveBanPostProposal = contentId => async (dispatch, getState) => {
  const { communityId, userId, permlink } = contentId;

  const state = getState();

  const { issuer } = entitySelector('communities', communityId)(state);

  const data = {
    commun_code: communityId,
    message_id: {
      author: userId,
      permlink,
    },
  };

  const trx = await dispatch({
    [COMMUN_API]: {
      contract: 'gallery',
      method: 'ban',
      params: data,
      auth: {
        actor: issuer,
        permission: 'lead.minor',
      },
      options: {
        msig: true,
        raw: true,
        msigExpires: DEFAULT_PROPOSAL_EXPIRES,
      },
    },
  });

  const results = await dispatch(
    createCommunityProposal({ communityId, trx, permission: 'lead.minor' })
  );

  dispatch({
    type: SET_BAN_POST_PROPOSAL,
    payload: {
      contentUrl: formatContentId(contentId),
      fullProposalId: formatProposalId(results),
    },
  });

  try {
    // eslint-disable-next-line camelcase
    const { transaction_id } = await dispatch(approveProposal(results));
    // eslint-disable-next-line camelcase
    results.transaction_id = transaction_id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Can't approve proposal:", err);
  }

  return results;
};
