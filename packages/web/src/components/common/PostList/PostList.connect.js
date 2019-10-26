import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchPosts } from 'store/actions/gate';
import { statusSelector, modeSelector } from 'store/selectors/common';

import PostList from './PostList';

export default connect(
  createSelector(
    [statusSelector('feed'), modeSelector],
    (feedStatus, mode) => ({
      fetchError: feedStatus.error,
      order: feedStatus.order,
      isLoading: feedStatus.isLoading,
      isAllowLoadMore: !feedStatus.isLoading && !feedStatus.isEnd,
      isOneColumnMode: mode.isOneColumnMode,
    })
  ),
  {
    fetchPosts,
  }
)(PostList);
