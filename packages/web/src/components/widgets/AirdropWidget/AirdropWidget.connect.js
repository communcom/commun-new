import { compose } from 'redux';
import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_SIGNUP } from 'store/constants';
import { getAirdrop } from 'store/actions/gate';
import { unauthSetAirdropCommunity } from 'store/actions/local/unauth';
import { dataSelector } from 'store/selectors/common';
import { settingsSelector } from 'store/selectors/settings';
import { isAuthorizedSelector } from 'store/selectors/auth';

import AirdropWidget from './AirdropWidget';

export default compose(
  connect(
    state => {
      const isAuthorized = isAuthorizedSelector(state);
      const isAutoLogging = dataSelector(['auth', 'isAutoLogging'])(state);
      const communityId = 'DANK';
      let hide = false;

      if (isAutoLogging) {
        hide = true;
      } else if (isAuthorized) {
        const system = settingsSelector(['system'])(state);

        if (system) {
          hide = Boolean(system?.airdrop?.claimed?.includes(communityId));
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
