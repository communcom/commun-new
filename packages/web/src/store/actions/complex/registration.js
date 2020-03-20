/* eslint-disable import/prefer-default-export */
import { replaceRouteAndAddQuery } from 'utils/router';
import { removeRegistrationData } from 'utils/localStore';
import { gevent } from 'utils/analytics';
import { dataSelector } from 'store/selectors/common';
import { fetchToBlockChain } from 'store/actions/gate/registration';
import { displayError } from 'utils/toastsMessages';
import { getAirdrop, fetchOnboardingCommunitySubscriptions } from 'store/actions/gate';
import { joinCommunity } from 'store/actions/commun';

export const claimAirdrop = () => async (dispatch, getState) => {
  const airdropCommunityId = dataSelector(['unauth', 'airdropCommunityId'])(getState());

  if (airdropCommunityId) {
    try {
      await dispatch(joinCommunity(airdropCommunityId));
    } catch (err) {
      // skip error
    }

    try {
      await dispatch(
        getAirdrop({
          communityId: airdropCommunityId,
        })
      );
    } catch (err) {
      if (err.message.startsWith('GateError airdrop.getAirdrop: ')) {
        displayError(err.message.replace(/^GateError airdrop\.getAirdrop: /, ''));
      } else {
        displayError("Can't claim airdrop, try later", err);
      }
    }
  }
};

export const onboardingSubscribeAfterOauth = (communities, userId) => async dispatch => {
  if (communities.length && userId) {
    try {
      await Promise.all(communities.map(communityId => dispatch(joinCommunity(communityId))));
      await dispatch(
        fetchOnboardingCommunitySubscriptions({
          userId,
          communities,
        })
      );
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
    }
  }
};

export const registrationUser = () => async dispatch => {
  const result = await dispatch(fetchToBlockChain());

  if (!result) {
    return null;
  }

  if (typeof result === 'string') {
    return result;
  }

  // Need to start without await! It's parallel start
  dispatch(claimAirdrop());

  removeRegistrationData();

  gevent('conversion', {
    allow_custom_scripts: true,
    send_to: 'DC-9830171/invmedia/commu0+standard',
  });

  if (window.fbq) {
    window.fbq('track', 'CompleteRegistration');
  }

  replaceRouteAndAddQuery({
    invite: result.userId,
  });

  return result;
};
