import { connect } from 'react-redux';
import { compose } from 'redux';

import { joinCommunity } from 'store/actions/commun';
import { getAirdrop } from 'store/actions/gate';
import { unauthSetAirdropCommunity } from 'store/actions/local/unauth';
import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_SIGNUP } from 'store/constants';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';
import { settingsSelector } from 'store/selectors/settings';

import AirdropWidget from './AirdropWidget';

export default compose(
  connect(
    state => {
      const isAuthorized = isAuthorizedSelector(state);
      const isAutoLogging = dataSelector(['auth', 'isAutoLogging'])(state);
      const communityId = 'DANK';
      let hide = false;

      if (!isAutoLogging && isAuthorized) {
        const system = settingsSelector(['system'])(state);

        if (system) {
          hide = Boolean(system?.airdrop?.claimed?.includes(communityId));
        } else {
          hide = true;
        }
      }

      return {
        isAutoLogging,
        isAuthorized,
        communityId,
        hide,
      };
    },
    {
      joinCommunity,
      getAirdrop,
      unauthSetAirdropCommunity,
      openSignUpModal: () => openModal(SHOW_MODAL_SIGNUP),
    }
  )
)(AirdropWidget);
