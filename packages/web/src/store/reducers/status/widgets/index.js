import { combineReducers } from 'redux';

import communityLeaders from './communityLeaders';
import communityMembers from './communityMembers';
import leaderCommunities from './leaderCommunities';
import managementCommunities from './managementCommunities';
import trendingCommunities from './trendingCommunities';
import userLeaderCommunities from './userLeaderCommunities';

export default combineReducers({
  communityMembers,
  communityLeaders,
  trendingCommunities,
  leaderCommunities,
  userLeaderCommunities,
  managementCommunities,
});
