import { connect } from 'react-redux';

import { openCreateCommunityDataModal, openModalConvertPoint } from 'store/actions/modals';
import { userCommunPointSelector } from 'store/selectors/wallet';

import CreateCommunityConfirmation from './CreateCommunityConfirmation';

export default connect(
  state => ({
    communPoint: userCommunPointSelector(state),
    communBalance: parseFloat(userCommunPointSelector(state).balance),
  }),
  {
    openModalConvertPoint,
    openCreateCommunityDataModal,
  }
)(CreateCommunityConfirmation);
