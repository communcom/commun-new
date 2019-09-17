import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import TotalBalance from './TotalBalance';

export default connect(
  null,
  {
    openModal,
  }
)(TotalBalance);
