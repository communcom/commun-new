import { connect } from 'react-redux';

import { isOwnerSelector } from 'store/selectors/user';
import { entityArraySelector, statusSelector } from 'store/selectors/common';
import { fetchMyCommunities } from 'store/actions/gate';

import My from './My';

export default connect(
  (state, props) => {
    const isOwner = isOwnerSelector(props.userId)(state);
    const communitiesStatus = statusSelector('myCommunities')(state);

    return {
      items: entityArraySelector('communities', communitiesStatus.order)(state),
      isOwner,
      isAllowLoadMore: !communitiesStatus.isLoading && !communitiesStatus.isEnd,
    };
  },
  {
    fetchMyCommunities,
  }
)(My);
