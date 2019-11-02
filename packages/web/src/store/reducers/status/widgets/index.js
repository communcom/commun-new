import { combineReducers } from 'redux';

import communityMembers from './communityMembers';
import communityLeaders from './communityLeaders';
import trendingCommunities from './trendingCommunities';
import leaderCommunities from './leaderCommunities';

export default combineReducers({
  communityMembers,
  communityLeaders,
  trendingCommunities,
  leaderCommunities,
});
