import { connect } from 'react-redux';

import { selectCommunity } from 'store/actions/ui';
import { entitySelector } from 'store/selectors/common';

import CommunityLeaderMobileMenuModal from './CommunityLeaderMobileMenuModal';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);

    return {
      community,
    };
  },
  {
    selectCommunity,
  }
)(CommunityLeaderMobileMenuModal);
