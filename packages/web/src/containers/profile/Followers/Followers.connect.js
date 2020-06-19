import { connect } from 'react-redux';

import { getUserSubscribers } from 'store/actions/gate';
import { openModalEditor } from 'store/actions/modals';
import { dataSelector, entityArraySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

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
    openModalEditor,
  }
)(Followers);
