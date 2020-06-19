import { connect } from 'react-redux';

import { fetchUsersBlacklist } from 'store/actions/gate/blacklist';
import { entityArraySelector, statusSelector } from 'store/selectors/common';

import UsersBlacklist from './UsersBlacklist';

export default connect(
  state => {
    const { order, isLoading, isEnd } = statusSelector('usersBlacklist')(state);
    return {
      items: entityArraySelector('users', order)(state),
      isEnd,
      isLoading,
    };
  },
  {
    fetchUsersBlacklist,
  }
)(UsersBlacklist);
