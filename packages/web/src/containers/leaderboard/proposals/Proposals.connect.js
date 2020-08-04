import { connect } from 'react-redux';

import { fetchLeaderProposals } from 'store/actions/gate';
import { compareSelectedCommunities } from 'store/actions/select';
import { statusLeaderBoardSelector, uiSelector } from 'store/selectors/common';

import Proposals from './Proposals';

export default connect(
  state => {
    const { order, isLoading, isEnd } = statusLeaderBoardSelector('proposals')(state);
    const selectedCommunities = uiSelector(['leaderboard', 'selectedCommunities'])(state);

    return {
      order,
      isLoading,
      isEnd,
      selectedCommunities,
    };
  },
  {
    fetchLeaderProposals,
    compareSelectedCommunities,
  }
)(Proposals);
