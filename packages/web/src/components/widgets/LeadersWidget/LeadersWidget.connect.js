import { connect } from 'react-redux';
import { compose } from 'redux';
import { branchOnFeatureToggle } from '@flopflip/react-redux';

import { FEATURE_LEADERS_WIDGET } from 'shared/featureFlags';
import { entitySelector } from 'store/selectors/common';
import LeadersWidget from './LeadersWidget';

export default compose(
  branchOnFeatureToggle({ flag: FEATURE_LEADERS_WIDGET }),
  connect((state, props) => {
    // TODO: replace width real data
    const leaders = [
      {
        username: 'nickshtefan',
        name: 'Nick Shtefan',
        title: 'Owner',
      },
      {
        username: 'joseph.kalu',
        name: 'Joseph Kalu',
        title: 'Admin',
      },
      {
        username: 'destroyer2k',
        name: 'John Doe',
        title: 'Editor',
      },
      {
        username: 'john.doe',
        name: 'John Doe',
        title: 'Editor',
      },
      {
        username: 'john.malkovich',
        name: 'John Malkovich',
        title: 'Editor',
      },
    ];

    return {
      leaders,
      community: entitySelector('communities', props.communityId)(state),
    };
  })
)(LeadersWidget);
