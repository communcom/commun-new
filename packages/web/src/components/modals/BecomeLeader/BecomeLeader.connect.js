import { connect } from 'react-redux';

import { becomeLeader } from 'store/actions/commun';

import BecomeLeader from './BecomeLeader';

export default connect(
  null,
  {
    becomeLeader,
  }
)(BecomeLeader);
