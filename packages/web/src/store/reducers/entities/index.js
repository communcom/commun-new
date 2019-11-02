import { combineReducers } from 'redux';

import posts from './posts';
import postComments from './postComments';
import profileComments from './profileComments';
import communities from './communities';
import users from './users';
import profiles from './profiles';
import leaders from './leaders';
import notifications from './notifications';
import proposals from './proposals';
import reports from './reports';

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
});
