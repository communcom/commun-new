import { COMMUN_API } from 'store/middlewares/commun-api';
import { checkAuth } from 'store/actions/complex';
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
} from 'store/constants';

export const DEFAULT_PROPOSAL_EXPIRES = 2592000; // в секундах (2592000 = 30 суток)

export function generateRandomProposalId(prefix = 'pr') {
  const numbers = [];

  for (let i = 0; i < 12 - prefix.length; i += 1) {
    numbers.push(Math.floor(Math.random() * 5 + 1));
  }

  return `${prefix}${numbers.join('')}`;
}

export const createCommunityProposal = ({ communityId, trx }) => async dispatch => {
  const userId = await dispatch(checkAuth());

  const data = {
    commun_code: communityId,
    proposer: userId,
    proposal_name: generateRandomProposalId(),
    permission: 'lead.smajor',
    trx,
  };

  return dispatch({
    [COMMUN_API]: {
      contract: 'ctrl',
      method: 'propose',
      params: data,
    },
  });
};

export const voteBan = ({ communityId, contentId }) => async (dispatch, getState) => {
  const state = getState();

  const { issuer } = entitySelector('communities', communityId)(state);

  const data = {
    commun_code: communityId,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
  };

  const trx = await dispatch({
    [COMMUN_API]: {
      contract: 'gallery',
      method: 'ban',
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
  return ({ community, proposer, proposalId }) => async dispatch => {
    const userId = await dispatch(checkAuth());

    const params = {
      proposer: proposer.userId,
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
        proposer: proposer.userId,
        proposalId,
        communityId: community.communityId,
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

export const execProposal = ({ community, proposer, proposalId }) => async dispatch => {
  const userId = await dispatch(checkAuth());

  return dispatch({
    [COMMUN_API]: {
      types: [EXEC_PROPOSAL, EXEC_PROPOSAL_SUCCESS, EXEC_PROPOSAL_ERROR],
      contract: 'ctrl',
      method: 'exec',
      params: {
        proposer: proposer.userId,
        proposal_name: proposalId,
        executer: userId,
      },
    },
    meta: {
      proposer: proposer.userId,
      proposalId,
      communityId: community.communityId,
    },
  });
};
