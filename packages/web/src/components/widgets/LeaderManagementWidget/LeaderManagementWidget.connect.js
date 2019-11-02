import { connect } from 'react-redux';

import { statusWidgetSelector, entityArraySelector } from 'store/selectors/common';
import { fetchManagementCommunities } from 'store/actions/gate';

import LeaderManagementWidget from './LeaderManagementWidget';

export default connect(
  state => {
    const { order, isLoading, isLoaded } = statusWidgetSelector('managementCommunities')(state);
    const items = entityArraySelector('communities', order)(state);

    return {
      items,
      isLoading,
      isLoaded,
    };
  },
  {
    fetchManagementCommunities,
  }
)(LeaderManagementWidget);
