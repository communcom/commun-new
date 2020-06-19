import { connect } from 'react-redux';

import { claimLeader, pin, unpin } from 'store/actions/commun';
import { fetchLeadersWidgetIfEmpty } from 'store/actions/complex';
import { waitForTransaction } from 'store/actions/gate';
import { amILeaderSelector } from 'store/selectors/auth';
import { entityArraySelector, entitySelector, statusWidgetSelector } from 'store/selectors/common';

import LeadersWidget from './LeadersWidget';

function bringToMaxLeadersCount(items, community) {
  const filteredItems = items.filter(({ isActive, inTop }) => isActive && inTop);

  if (!items.length || !filteredItems.length) {
    return null;
  }

  const maxTopLeadersCount = Math.min(5, community.maxActiveLeadersCount);

  if (filteredItems.length > maxTopLeadersCount) {
    return filteredItems.slice(0, maxTopLeadersCount);
  }

  return filteredItems;
}

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
      items: bringToMaxLeadersCount(items, community),
      isLeader: amILeaderSelector(communityId)(state),
    };
  },
  {
    fetchLeadersWidgetIfEmpty,
    pin,
    unpin,
    claimLeader,
    waitForTransaction,
  }
)(LeadersWidget);
