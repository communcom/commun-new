import React from 'react';
import { Link } from 'shared/routes';
import { extendedPostType } from 'types/common';

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
