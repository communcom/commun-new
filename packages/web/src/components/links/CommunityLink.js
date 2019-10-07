import React from 'react';
import PropTypes from 'prop-types';

import { communityType } from 'types/common';
import { Link } from 'shared/routes';

export default function CommunityLink({ community, children, ...props }) {
  if (!community) {
    return children;
  }

  const routeParams = {
    communityId: typeof community === 'string' ? community : community.id,
  };

  return (
    <Link {...props} route="community" params={routeParams} passHref>
      {children}
    </Link>
  );
}

CommunityLink.propTypes = {
  community: PropTypes.oneOfType([PropTypes.string, communityType]).isRequired,
};
