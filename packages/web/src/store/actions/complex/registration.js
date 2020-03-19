/* eslint-disable import/prefer-default-export */
import { dataSelector } from 'store/selectors/common';
import { fetchToBlockChain } from 'store/actions/gate/registration';
import { replaceRouteAndAddQuery } from 'utils/router';
import { removeRegistrationData } from 'utils/localStore';
import { displayError } from 'utils/toastsMessages';
import { gevent } from 'utils/analytics';
import { getAirdrop } from 'store/actions/gate';
import { joinCommunity } from 'store/actions/commun';

export const registrationUser = () => async (dispatch, getState) => {
  const result = await dispatch(fetchToBlockChain());

  if (!result) {
    return null;
  }

  if (typeof result === 'string') {
    return result;
  }

  const airdropCommunityId = dataSelector(['unauth', 'airdropCommunityId'])(getState());

  if (airdropCommunityId) {
    (async () => {
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
        displayError("Can't claim airdrop, try later", err);
      }
    })();
  }

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
