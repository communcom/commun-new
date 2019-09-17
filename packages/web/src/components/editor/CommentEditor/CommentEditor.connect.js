import { connect } from 'react-redux';
import { getEmbed } from 'store/actions/gate';

import CommentEditor from './CommentEditor';

export default connect(
  null,
  { getEmbed }
)(CommentEditor);
