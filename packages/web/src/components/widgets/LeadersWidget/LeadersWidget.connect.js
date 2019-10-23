import { connect } from 'react-redux';

import { entitySelector, statusWidgetSelector, entityArraySelector } from 'store/selectors/common';
import { fetchLeadersWidgetIfEmpty } from 'store/actions/complex';

import LeadersWidget from './LeadersWidget';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);
    const { communityId, order } = statusWidgetSelector('communityLeaders')(state);
    const items = entityArraySelector('leaders', order)(state);

    if (props.communityId !== communityId) {
      return {
        community,
        items: [],
      };
    }

    return {
      community,
      items,
    };
  },
  {
    fetchLeadersWidgetIfEmpty,
  }
)(LeadersWidget);
