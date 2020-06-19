import { connect } from 'react-redux';

import { pin, unpin } from 'store/actions/commun';
import { fetchCommunityMembersWidgetIfEmpty } from 'store/actions/complex';
import { entityArraySelector, entitySelector, statusWidgetSelector } from 'store/selectors/common';

import MembersWidget from './MembersWidget';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);
    const { communityId, order } = statusWidgetSelector('communityMembers')(state);

    if (props.communityId !== communityId) {
      return {
        community,
        items: [],
      };
    }

    return {
      community,
      items: entityArraySelector('users', order)(state),
    };
  },
  {
    fetchCommunityMembersWidgetIfEmpty,
    pin,
    unpin,
  }
)(MembersWidget);
