import { connect } from 'react-redux';

import { statusLeaderBoardSelector, uiSelector } from 'store/selectors/common';
import { compareSelectedCommunities } from 'store/actions/select';
import { fetchReportsList } from 'store/actions/gate';

import Reports from './Reports';

export default connect(
  state => {
    const { order, isLoading, isEnd } = statusLeaderBoardSelector('reports')(state);
    const selectedCommunities = uiSelector(['leaderBoard', 'selectedCommunities'])(state);

    return {
      order,
      isLoading,
      isEnd,
      selectedCommunities,
    };
  },
  {
    fetchReportsList,
    compareSelectedCommunities,
  }
)(Reports);
