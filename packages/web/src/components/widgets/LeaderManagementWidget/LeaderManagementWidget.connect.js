import { connect } from 'react-redux';

import { fetchManagementCommunities } from 'store/actions/gate';
import { entityArraySelector, statusWidgetSelector } from 'store/selectors/common';

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
