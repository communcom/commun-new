import { connect } from 'react-redux';

import { extendedPostSelector } from 'store/selectors/common';
import { formatContentId } from 'store/schemas/gate';

import PostModal from './PostModal';

export default connect((state, props) => ({
  post: extendedPostSelector(formatContentId(props.contentId))(state),
}))(PostModal);
