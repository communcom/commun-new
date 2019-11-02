import { connect } from 'react-redux';

import { statusLeaderBoardSelector, uiSelector } from 'store/selectors/common';
import { fetchLeaderProposals } from 'store/actions/gate';
import { clearLeaderBoard } from 'store/actions/status';

import Proposals from './Proposals';

export default connect(
  state => {
    const { order, isLoading, isEnd } = statusLeaderBoardSelector('proposals')(state);
    const selectedCommunities = uiSelector(['leaderBoard', 'selectedCommunities'])(state);

    return {
      order,
      isLoading,
      isEnd,
      selectedCommunities,
    };
  },
  {
    fetchLeaderProposals,
    clearLeaderBoard,
  }
)(Proposals);
