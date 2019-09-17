import { connect } from 'react-redux';
import { compose } from 'redux';
import { branchOnFeatureToggle } from '@flopflip/react-redux';

import { FEATURE_LEADERS_WIDGET } from 'shared/feature-flags';
import LeadersWidget from './LeadersWidget';

export default compose(
  branchOnFeatureToggle({ flag: FEATURE_LEADERS_WIDGET }),
  connect(() => {
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
    };
  })
)(LeadersWidget);
