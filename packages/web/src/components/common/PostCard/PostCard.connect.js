import { connect } from 'react-redux';

import { extendedPostSelector } from 'store/selectors/common';

import PostCard from './PostCard';

export default connect((state, props) => ({
  post: extendedPostSelector(props.postId)(state),
}))(PostCard);
