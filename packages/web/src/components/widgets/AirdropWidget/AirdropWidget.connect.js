import { compose } from 'redux';
import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_SIGNUP } from 'store/constants';
import { getAirdrop } from 'store/actions/gate';
import { unauthSetAirdropCommunity } from 'store/actions/local/unauth';
import { settingsSelector } from 'store/selectors/settings';
import { isAuthorizedSelector } from 'store/selectors/auth';

import AirdropWidget from './AirdropWidget';

export default compose(
  connect(
    state => {
      const isAuthorized = isAuthorizedSelector(state);

      let communityId = 'MEME';

      // TODO: Temporary uses PROGRAM community for testing on dev
      if (process.browser && window.location.host !== 'commun.com') {
        communityId = 'PROGRAM';
      }

      let hide = false;

      if (isAuthorized) {
        const claimed = settingsSelector(['system', 'airdrop', 'claimed'])(state);

        if (claimed) {
          hide = claimed.includes(communityId);
        } else {
          hide = true;
        }
      }

      return {
        isAuthorized,
        communityId,
        hide,
      };
    },
    {
      getAirdrop,
      unauthSetAirdropCommunity,
      openSignUpModal: () => openModal(SHOW_MODAL_SIGNUP),
    }
  )
)(AirdropWidget);
