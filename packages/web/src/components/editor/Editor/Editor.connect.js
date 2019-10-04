import { connect } from 'react-redux';

import { getEmbed } from 'store/actions/gate';

import Editor from './Editor';

export default connect(
  null,
  { getEmbed }
)(Editor);
