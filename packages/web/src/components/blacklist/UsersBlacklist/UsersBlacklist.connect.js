import { connect } from 'react-redux';

import { statusSelector, entityArraySelector } from 'store/selectors/common';
import { fetchUsersBlacklist } from 'store/actions/gate/blacklist';

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
