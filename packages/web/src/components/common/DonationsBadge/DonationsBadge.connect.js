import { connect } from 'react-redux';

import { openDonateModal, openDonationsModal } from 'store/actions/modals';
import { entitySelector } from 'store/selectors/common';

import DonationsBadge from './DonationsBadge';

export default connect(
  (state, props) => ({
    donations: entitySelector('donations', props.entity.id)(state)?.donations || [],
  }),
  {
    openDonationsModal,
    openDonateModal,
  }
)(DonationsBadge);
