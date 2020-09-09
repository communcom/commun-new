import { connect } from 'react-redux';
import { closeTopModal } from 'redux-modals-manager';

import DonationRow from './DonationRow';

export default connect(null, {
  closeTopModal,
})(DonationRow);
