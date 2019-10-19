import { combineReducers } from 'redux';

import communityMembers from './communityMembers';
import trendingCommunities from './trendingCommunities';

export default combineReducers({
  communityMembers,
  trendingCommunities,
});
