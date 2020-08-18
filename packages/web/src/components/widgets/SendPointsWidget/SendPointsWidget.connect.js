import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { isOwnerSelector } from 'store/selectors/user';

import SendPointsWidget from './SendPointsWidget';

export default connect(
  (state, props) => ({
    isOwner: isOwnerSelector(props.profile.userId)(state),
  }),
  { openModal }
)(SendPointsWidget);
