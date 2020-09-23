import { connect } from 'react-redux';

import { fetchLeaderProposals } from 'store/actions/gate';
import { statusLeaderboardSelector } from 'store/selectors/common';

import Proposals from './Proposals';

export default connect(
  state => {
    const { order, isLoading, isEnd } = statusLeaderboardSelector('proposals')(state);

    return {
      order,
      isLoading,
      isEnd,
    };
  },
  {
    fetchLeaderProposals,
  }
)(Proposals);
