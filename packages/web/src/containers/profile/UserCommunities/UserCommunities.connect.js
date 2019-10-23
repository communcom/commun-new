import { connect } from 'react-redux';

import { entitySelector, entityArraySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import UserCommunities from './UserCommunities';

export default connect((state, props) => {
  const profile = entitySelector('profiles', props.userId)(state);
  const isOwner = isOwnerSelector(props.userId)(state);
  const communities = profile?.commonCommunities || [];
  const order = communities.map(item => item.communityId);

  return {
    items: entityArraySelector('communities', order)(state),
    isOwner,
  };
})(UserCommunities);
