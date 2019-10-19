import { combineReducers } from 'redux';

import widgets from './widgets';

import feed from './feed';
import postComments from './postComments';
import profileComments from './profileComments';
import registration from './registration';
import notifications from './notifications';
import contracts from './contracts';
import wallet from './wallet';
import communities from './communities';
import myCommunities from './myCommunities';
import communityMembers from './communityMembers';

export default combineReducers({
  widgets,
  feed,
  postComments,
  profileComments,
  registration,
  notifications,
  contracts,
  wallet,
  communities,
  myCommunities,
  communityMembers,
});
