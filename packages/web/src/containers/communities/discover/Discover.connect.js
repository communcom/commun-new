import { connect } from 'react-redux';

import { getCommunities } from 'store/actions/gate';

import Discover from './Discover';

export default connect(
  null,
  { getCommunities }
)(Discover);
