import { combineReducers } from 'redux';

import feed from './feed';
import postComments from './postComments';
import profileComments from './profileComments';
import registration from './registration';
import notifications from './notifications';
import contracts from './contracts';
import wallet from './wallet';

export default combineReducers({
  feed,
  postComments,
  profileComments,
  registration,
  notifications,
  contracts,
  wallet,
});
