import { combineReducers } from 'redux';

import communityMembers from './communityMembers';
import communityLeaders from './communityLeaders';
import trendingCommunities from './trendingCommunities';
import leaderCommunities from './leaderCommunities';
import managementCommunities from './managementCommunities';

export default combineReducers({
  communityMembers,
  communityLeaders,
  trendingCommunities,
  leaderCommunities,
  managementCommunities,
});
