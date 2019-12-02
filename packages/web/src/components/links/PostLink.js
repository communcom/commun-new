import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { extendedPostType } from 'types/common';
import { Link } from 'shared/routes';
import { currentUserIdSelector } from 'store/selectors/auth';

export default function PostLink({ post, children, ...props }) {
  if (!post) {
    return children;
  }

  let routeParams;

  try {
    routeParams = {
      communityAlias: post.community.alias,
      permlink: post.contentId.permlink,
      username: post.author.username,
    };
  } catch {
    // eslint-disable-next-line no-console
    console.error('Invalid post structure:', post);
    return children;
  }

  if (!routeParams.communityAlias || !routeParams.permlink || !routeParams.username) {
    // eslint-disable-next-line no-console
    console.error('Invalid post data:', post);
    return children;
  }

  return (
    <Link {...props} route="post" params={routeParams} passHref>
      {children}
    </Link>
  );
}

PostLink.propTypes = {
  post: extendedPostType.isRequired,
};
