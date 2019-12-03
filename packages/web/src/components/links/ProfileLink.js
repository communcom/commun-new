/* eslint-disable react/require-default-props,prefer-destructuring */

import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'shared/routes';

export default function ProfileLink({ user, allowEmpty, section, children, ...props }) {
  let username = null;

  if (user) {
    if (typeof user === 'string') {
      username = user;
    } else {
      username = user.username;
    }
  }

  if (!username) {
    if (!allowEmpty) {
      // eslint-disable-next-line no-console
      console.error('ProfileLink without user:', user);
    }

    return children;
  }

  const routeParams = {
    username,
    section,
  };

  return (
    <Link {...props} route="profile" params={routeParams} passHref>
      {children}
    </Link>
  );
}

ProfileLink.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
    PropTypes.string,
  ]),
  section: PropTypes.oneOf(['comments', 'following', 'followers', 'settings']),
  allowEmpty: PropTypes.bool,
};
