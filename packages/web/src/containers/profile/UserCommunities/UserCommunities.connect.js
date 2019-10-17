import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { unpin } from 'store/actions/commun/social';

import UserCommunities from './UserCommunities';

export default connect(
  (state, props) => ({
    profile: entitySelector('profiles', props.userId)(state),
    isOwner: isOwnerSelector(props.userId)(state),
  }),
  {
    unpin,
  }
)(UserCommunities);
