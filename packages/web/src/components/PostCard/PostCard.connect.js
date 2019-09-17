import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import PostCard from './PostCard';

export default connect((state, props) => {
  const post = entitySelector('posts', props.postId)(state);

  let user = null;

  // В некоторых случаях Prism может не отдать пользователя так как его нет в кеше.
  if (post.author) {
    user = entitySelector('users', post.author)(state);
  }

  const community = entitySelector('communities', post.community)(state);

  return {
    post,
    community,
    user,
  };
})(PostCard);
