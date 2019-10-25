import { connect } from 'react-redux';

import { isOwnerSelector } from 'store/selectors/user';

import UserFeed from './UserFeed';

export default connect((state, props) => {
  const isOwner = isOwnerSelector(props.userId)(state);

  return {
    isOwner,
  };
})(UserFeed);
