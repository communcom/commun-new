import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';

import CommentEditor from './CommentEditor';

export default connect(state => ({
  isMobile: modeSelector(state).screenType === 'mobile',
}))(CommentEditor);
