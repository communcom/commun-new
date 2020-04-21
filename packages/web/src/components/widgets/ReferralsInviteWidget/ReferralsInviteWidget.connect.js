import { connect } from 'react-redux';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { openModal } from 'store/actions/modals';

import ReferralsInviteWidget from './ReferralsInviteWidget';

export default connect(
  state => ({
    currentUserId: currentUnsafeUserIdSelector(state),
  }),
  {
    openModal,
  }
)(ReferralsInviteWidget);
