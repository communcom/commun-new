import { connect } from 'react-redux';
import { compose } from 'redux';
import { branchOnFeatureToggle } from '@flopflip/react-redux';

import { FEATURE_USER_COMMUNITIES_WIDGET } from 'shared/feature-flags';
import { entitySelector } from 'store/selectors/common';
import UserCommunitiesWidget from './UserCommunitiesWidget';

export default compose(
  branchOnFeatureToggle({ flag: FEATURE_USER_COMMUNITIES_WIDGET }),
  connect((state, props) => ({
    user: entitySelector('users', props.userId)(state),
    items: [
      {
        communityId: 'PH',
        alias: 'id123',
        name: 'photographers',
        followersQuantity: 342,
      },
      {
        communityId: 'overwatch',
        alias: 'id123',
        name: 'overwatch',
        followersQuantity: 12943,
      },
      {
        communityId: 'ADM',
        alias: 'id123',
        name: 'adme',
        followersQuantity: 501475,
      },
      {
        communityId: 'SMT',
        alias: 'id123',
        name: 'something',
        followersQuantity: 2010,
      },
    ],
  }))
)(UserCommunitiesWidget);
