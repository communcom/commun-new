import { combineReducers } from 'redux';

import communities from './communities';
import donations from './donations';
import leaders from './leaders';
import notifications from './notifications';
import postComments from './postComments';
import posts from './posts';
import profileComments from './profileComments';
import profiles from './profiles';
import proposals from './proposals';
import reports from './reports';
import rewards from './rewards';
import users from './users';

export default combineReducers({
  posts,
  postComments,
  profileComments,
  communities,
  users,
  profiles,
  leaders,
  notifications,
  proposals,
  reports,
  rewards,
  donations,
});
