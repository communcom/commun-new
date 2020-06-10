import { connect } from 'react-redux';

import { statusSelector, entityArraySelector } from 'store/selectors/common';
import { fetchCommunitiesBlacklist } from 'store/actions/gate/blacklist';

import CommunitiesBlacklist from './CommunitiesBlacklist';

export default connect(
  state => {
    const { order, isLoading, isEnd } = statusSelector('communitiesBlacklist')(state);
    return {
      items: entityArraySelector('communities', order)(state),
      isEnd,
      isLoading,
    };
  },
  {
    fetchCommunitiesBlacklist,
  }
)(CommunitiesBlacklist);
