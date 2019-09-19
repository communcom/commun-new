import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { pin, unpin } from 'store/actions/commun';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';

import UserRow from './UserRow';

export default connect(
  (state, props) => {
    const user = entitySelector('users', props.userId)(state);
    const isOwnerUser = isOwnerSelector(props.userId)(state);

    return {
      user,
      isOwnerUser,
    };
  },
  {
    pin,
    unpin,
    fetchProfile,
    waitForTransaction,
  }
)(UserRow);
