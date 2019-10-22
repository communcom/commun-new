import { combineReducers } from 'redux';

import communityMembers from './communityMembers';
import communityLeaders from './communityLeaders';
import trendingCommunities from './trendingCommunities';

export default combineReducers({
  communityMembers,
  communityLeaders,
  trendingCommunities,
});
