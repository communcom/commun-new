import { connect } from 'react-redux';
import { compose } from 'redux';
import { branchOnFeatureToggle } from '@flopflip/react-redux';

import { FEATURE_MEMBERS_WIDGET } from 'shared/feature-flags';
import { entitySelector } from 'store/selectors/common';
import MembersWidget from './MembersWidget';

export default compose(
  branchOnFeatureToggle({ flag: FEATURE_MEMBERS_WIDGET }),
  connect((state, props) => {
    const community = entitySelector('communities', props.communityId)(state);

    // TODO: replace width real data
    const members = [
      {
        username: 'nickshtefan',
        name: 'Nick Shtefan',
      },
      {
        username: 'joseph.kalu',
        name: 'Joseph Kalu',
      },
      {
        username: 'destroyer2k',
        name: 'John Doe',
      },
      {
        username: 'john.doe',
        name: 'John Doe',
      },
      {
        username: 'john.malkovich',
        name: 'John Malkovich',
      },
      {
        username: 'john.malkovich1',
        name: 'John Malkovich',
      },
      {
        username: 'john.malkovich2',
        name: 'John Malkovich',
      },
      {
        username: 'john.malkovich3',
        name: 'John Malkovich',
      },
      {
        username: 'john.malkovich4',
        name: 'John Malkovich',
      },
      {
        username: 'john.malkovich5',
        name: 'John Malkovich',
      },
      {
        username: 'john.malkovich6',
        name: 'John Malkovich',
      },
      {
        username: 'john.malkovich7',
        name: 'John Malkovich',
      },
      {
        username: 'john.malkovich8',
        name: 'John Malkovich',
      },
      {
        username: 'john.malkovich9',
        name: 'John Malkovich',
      },
    ];

    return {
      community,
      members,
    };
  })
)(MembersWidget);
