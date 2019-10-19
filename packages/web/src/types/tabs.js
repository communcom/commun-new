/* eslint-disable import/prefer-default-export */

import PropTypes from 'prop-types';

export const tabInfoType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  index: PropTypes.bool,
  includeSubRoutes: PropTypes.bool,
});
