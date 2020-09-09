import { connect } from 'react-redux';

import { openDonateModal, openDonationsModal } from 'store/actions/modals';
import { entitySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import DonationsBadge from './DonationsBadge';

export default connect(
  (state, props) => ({
    isOwner: isOwnerSelector(props.entity.contentId.userId)(state),
    donations: entitySelector('donations', props.entity.id)(state)?.donations || [],
  }),
  {
    openDonationsModal,
    openDonateModal,
  }
)(DonationsBadge);
