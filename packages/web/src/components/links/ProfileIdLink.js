import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import ProfileLink from './ProfileLink';

export default connect((state, props) => ({
  user: entitySelector('users', props.userId)(state),
}))(ProfileLink);
