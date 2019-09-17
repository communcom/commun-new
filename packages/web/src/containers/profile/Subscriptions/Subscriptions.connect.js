import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { entitySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { unpin } from 'store/actions/commun/social';
import Subscriptions from './Subscriptions';

export default connect(
  createStructuredSelector({
    profile: (state, props) => entitySelector('profiles', props.accountOwner)(state),
    isOwner: (state, props) => isOwnerSelector(props.accountOwner)(state),
  }),
  {
    unpin,
  }
)(Subscriptions);
