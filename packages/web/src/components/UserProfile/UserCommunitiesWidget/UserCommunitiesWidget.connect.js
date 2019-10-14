import { connect } from 'react-redux';
import { compose } from 'redux';
import { branchOnFeatureToggle } from '@flopflip/react-redux';

import { FEATURE_USER_COMMUNITIES_WIDGET } from 'shared/feature-flags';
import UserCommunitiesWidget from './UserCommunitiesWidget';

export default compose(
  branchOnFeatureToggle({ flag: FEATURE_USER_COMMUNITIES_WIDGET }),
  connect()
)(UserCommunitiesWidget);
