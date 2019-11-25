import { connect } from 'react-redux';

import { selectCommunity, clearCommunityFilter } from 'store/actions/ui';

import LeaderBoard from './LeaderBoard';

export default connect(
  null,
  {
    selectCommunity,
    clearCommunityFilter,
  }
)(LeaderBoard);
