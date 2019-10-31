import { connect } from 'react-redux';

import { statusLeaderBoardSelector } from 'store/selectors/common';
import { fetchLeaderProposals } from 'store/actions/gate';

import Proposals from './Proposals';

export default connect(
  state => {
    const { order, isLoading, isEnd } = statusLeaderBoardSelector('proposals')(state);

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
