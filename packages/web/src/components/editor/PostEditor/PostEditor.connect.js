import { connect } from 'react-redux';
import { getEmbed } from 'store/actions/gate';

import PostEditor from './PostEditor';

export default connect(
  null,
  { getEmbed }
)(PostEditor);
