import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'shared/routes';

export default function ProfileLink({ user, children, ...props }) {
  if (!user || !user.username) {
    return children;
  }

  const routeParams = {
    username: user.username,
  };

  return (
    <Link {...props} route="profile" params={routeParams} passHref>
      {children}
    </Link>
  );
}

ProfileLink.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};
