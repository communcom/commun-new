import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import ProfileLink from './ProfileLink';

const ProfileIdLink = connect((state, props) => ({
  user: entitySelector('users', props.userId)(state),
}))(ProfileLink);

export default ProfileIdLink;
