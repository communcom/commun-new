import React from 'react';
import PropTypes from 'prop-types';

import { communityType } from 'types/common';
import { Link } from 'shared/routes';

export default function CommunityLink({ community, section, children, ...props }) {
  if (!community) {
    return children;
  }

  const routeParams = {
    communityAlias: typeof community === 'string' ? community : community.alias,
  };

  if (!routeParams.communityAlias) {
    // eslint-disable-next-line no-console
    console.error('Invalid community structure:', community);
    return children;
  }

  if (section) {
    routeParams.section = section;
  }

  return (
    <Link {...props} route="community" params={routeParams} passHref>
      {children}
    </Link>
  );
}

CommunityLink.propTypes = {
  community: PropTypes.oneOfType([PropTypes.string, communityType]).isRequired,
  section: PropTypes.string,
};

CommunityLink.defaultProps = {
  section: undefined,
};
