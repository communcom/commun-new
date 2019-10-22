import { connect } from 'react-redux';

import { entityArraySelector, dataSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { getUserSubscribers } from 'store/actions/gate';
import { openEditor } from 'store/actions/ui';

import Followers from './Followers';

export default connect(
  (state, props) => {
    const isOwner = isOwnerSelector(props.userId)(state);
    const { order, isLoading, isEnd } = dataSelector(['subscribers'])(state);

    return {
      isOwner,
      items: entityArraySelector('users', order)(state),
      isLoading,
      isEnd,
    };
  },
  {
    getUserSubscribers,
    openEditor,
  }
)(Followers);
