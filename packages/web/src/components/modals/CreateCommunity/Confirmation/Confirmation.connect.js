import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_CREATE_COMMUNITY_NOT_ENOUGH } from 'store/constants';
import { userCommunPointSelector } from 'store/selectors/wallet';

import Confirmation from './Confirmation';

export default connect(
  state => {
    const userCommunBalance = userCommunPointSelector(state);

    return {
      communBalance: parseFloat(userCommunBalance.balance),
    };
  },
  {
    openNotEnoughModal: () => openModal(SHOW_MODAL_CREATE_COMMUNITY_NOT_ENOUGH),
  }
)(Confirmation);
