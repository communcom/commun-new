import { combineReducers } from 'redux';

import communities from './communities';
import communitiesBlacklist from './communitiesBlacklist';
import communityMembers from './communityMembers';
import createCommunity from './createCommunity';
import feed from './feed';
import leaderboard from './leaderboard';
import leaders from './leaders';
import myCommunities from './myCommunities';
import notifications from './notifications';
import notificationsTray from './notificationsTray';
import postComments from './postComments';
import profileComments from './profileComments';
import profileCommunities from './profileCommunities';
import profileReferrals from './profileReferrals';
import registration from './registration';
import reports from './reports';
import usersBlacklist from './usersBlacklist';
import wallet from './wallet';
import widgets from './widgets';

export default combineReducers({
  widgets,
  leaderboard,
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
