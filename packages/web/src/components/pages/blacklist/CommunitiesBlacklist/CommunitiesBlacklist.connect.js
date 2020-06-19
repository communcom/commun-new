import { connect } from 'react-redux';

import { fetchCommunitiesBlacklist } from 'store/actions/gate/blacklist';
import { entityArraySelector, statusSelector } from 'store/selectors/common';

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
