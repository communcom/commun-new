import { connect } from 'react-redux';
import { branchOnFeatureToggle } from '@flopflip/react-redux';
import { compose } from 'redux';

import { FEATURE_USER_COMMUNITIES_WIDGET } from 'shared/featureFlags';
import { entitySelector } from 'store/selectors/common';

import UserCommunitiesWidget from './UserCommunitiesWidget';

export default compose(
  branchOnFeatureToggle({ flag: FEATURE_USER_COMMUNITIES_WIDGET }),
  connect((state, props) => ({
    user: entitySelector('users', props.userId)(state),
    items: [],
  }))
)(UserCommunitiesWidget);
