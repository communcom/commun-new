import { COMMUN_SYMBOL, COMMUNITY_CREATION_TOKENS_NUMBER } from 'shared/constants';
import env from 'shared/env';
import { Router } from 'shared/routes';
import { getDefaultRules } from 'utils/community';
import { displayError } from 'utils/toastsMessages';
import { becomeLeader, joinCommunity, transfer, voteLeader } from 'store/actions/commun';
import {
  createNewCommunity,
  fetchCommunity,
  getCommunity,
  setCommunitySettings,
  startCommunityCreation,
  waitForTransaction,
} from 'store/actions/gate';
import { removeData } from 'store/actions/local';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

const transferTokensBeforeCreation = communityId => async dispatch => {
  const trx = await dispatch(
    transfer(
      env.WEB_COMMUNITY_CREATOR_USER_ID || 'communcreate',
      COMMUNITY_CREATION_TOKENS_NUMBER,
      COMMUN_SYMBOL,
      `for community: ${communityId}`
    )
  );

  const trxId = trx?.processed?.id;

  await dispatch(waitForTransaction(trxId));
  return trxId;
};

function getCommunitySettings(communityId, name, communityCreationState) {
  const language = communityCreationState.language?.code || 'en';
  const trimmedName = name.trim();

  const rules = communityCreationState.rules.length
    ? communityCreationState.rules
    : getDefaultRules(communityCreationState.language);

  return {
    ...communityCreationState,
    rules: JSON.stringify(rules),
    language: language.toLowerCase(),
    name: trimmedName,
    communityId,
  };
}

const clearDataAfterCreation = communityId => async (dispatch, getState) => {
  const userId = currentUnsafeUserIdSelector(getState());
  const result = await dispatch(fetchCommunity({ communityId }));

  if (result?.alias) {
    const { transaction_id: joinTrxId } = await dispatch(joinCommunity(communityId));
    await dispatch(waitForTransaction(joinTrxId));

    const { transaction_id: leaderTrxId } = await dispatch(
      becomeLeader({
        communityId,
        url: '',
      })
    );
    await dispatch(waitForTransaction(leaderTrxId));

    const { transaction_id: voteTrxId } = await dispatch(
      voteLeader({ communityId, leaderId: userId })
    );
    await dispatch(waitForTransaction(voteTrxId));

    dispatch(removeData());
    Router.pushRoute('community', { communityAlias: result.alias });
  }
};

export const createCommunity = name => async (dispatch, getState) => {
  const trimmedName = name.trim();
  const communityCreationState = dataSelector('createCommunity')(getState());

  try {
    const { community } = await dispatch(createNewCommunity({ name: trimmedName }));

    if (community && community.communityId) {
      const communitySettings = getCommunitySettings(
        community.communityId,
        name,
        communityCreationState
      );

      await dispatch(setCommunitySettings(communitySettings));
      const trxId = await dispatch(transferTokensBeforeCreation(community.communityId));
      await dispatch(startCommunityCreation(community.communityId, trxId));
      await dispatch(clearDataAfterCreation(community.communityId));
    }
  } catch (err) {
    displayError(err);
  }
};

// eslint-disable-next-line consistent-return
export const restoreCommunityCreation = (communityId, name) => async (dispatch, getState) => {
  if (!communityId) {
    return createCommunity();
  }

  try {
    const { community } = await dispatch(getCommunity(communityId));

    if (!community || community.isDone) {
      return createCommunity();
    }

    if (community.canChangeSettings) {
      const communityCreationState = dataSelector('createCommunity')(getState());
      const communitySettings = getCommunitySettings(communityId, name, communityCreationState);
      await dispatch(setCommunitySettings(communitySettings));
      const trxId = await dispatch(transferTokensBeforeCreation(communityId));
      await dispatch(startCommunityCreation(communityId, trxId));
    } else {
      await dispatch(startCommunityCreation(communityId));
    }

    await dispatch(clearDataAfterCreation(communityId));
  } catch (err) {
    displayError(err);
  }
};
