import { connect } from 'react-redux';

import { voteBan } from 'store/actions/commun';

import PostCardReports from './PostCardReports';

export default connect(
  null,
  {
    voteBan,
  }
)(PostCardReports);
