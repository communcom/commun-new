import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import CreateCommunity from './CreateCommunity';

export default connect(
  null,
  {
    openModal,
  }
)(CreateCommunity);
