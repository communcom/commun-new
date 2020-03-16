import { connect } from 'react-redux';

import { entityArraySelector, statusSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { getUserReferrals } from 'store/actions/gate';

import Referrals from './Referrals';

export default connect(
  (state, props) => {
    const isOwner = isOwnerSelector(props.userId)(state);
    const { order, isLoading, isEnd } = statusSelector(['profileReferrals'])(state);

    return {
      isOwner,
      items: entityArraySelector('users', order)(state),
      isLoading,
      isEnd,
    };
  },
  {
    getUserReferrals,
  }
)(Referrals);
