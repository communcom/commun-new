import { COMMUN_API } from 'store/middlewares/commun-api';
import { checkAuth } from 'store/actions/complex';
import { entitySelector } from 'store/selectors/common';

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
