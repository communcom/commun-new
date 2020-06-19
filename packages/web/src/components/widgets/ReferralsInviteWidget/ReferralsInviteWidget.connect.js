import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import ReferralsInviteWidget from './ReferralsInviteWidget';

export default connect(
  state => ({
    currentUserId: currentUnsafeUserIdSelector(state),
  }),
  {
    openModal,
  }
)(ReferralsInviteWidget);
