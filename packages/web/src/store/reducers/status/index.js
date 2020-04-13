import { combineReducers } from 'redux';

import widgets from './widgets';
import leaderBoard from './leaderBoard';
import feed from './feed';
import postComments from './postComments';
import profileComments from './profileComments';
import registration from './registration';
import notifications from './notifications';
import notificationsTray from './notificationsTray';
import leaders from './leaders';
import wallet from './wallet';
import communities from './communities';
import profileCommunities from './profileCommunities';
import myCommunities from './myCommunities';
import communityMembers from './communityMembers';
import reports from './reports';
import usersBlacklist from './usersBlacklist';
import communitiesBlacklist from './communitiesBlacklist';
import profileReferrals from './profileReferrals';
import createCommunity from './createCommunity';

export default combineReducers({
  widgets,
  leaderBoard,
  feed,
  postComments,
  profileComments,
  registration,
  notifications,
  notificationsTray,
  leaders,
  wallet,
  communities,
  profileCommunities,
  myCommunities,
  communityMembers,
  createCommunity,
  reports,
  usersBlacklist,
  communitiesBlacklist,
  profileReferrals,
});
