import { combineReducers } from 'redux';

import widgets from './widgets';
import leaderBoard from './leaderBoard';

import feed from './feed';
import postComments from './postComments';
import profileComments from './profileComments';
import registration from './registration';
import notifications from './notifications';
import contracts from './contracts';
import leaders from './leaders';
import wallet from './wallet';
import communities from './communities';
import profileCommunities from './profileCommunities';
import myCommunities from './myCommunities';
import communityMembers from './communityMembers';

export default combineReducers({
  widgets,
  leaderBoard,
  feed,
  postComments,
  profileComments,
  registration,
  notifications,
  contracts,
  leaders,
  wallet,
  communities,
  profileCommunities,
  myCommunities,
  communityMembers,
});
