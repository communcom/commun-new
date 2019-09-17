import { combineReducers } from 'redux';

import auth from './auth';
import chain from './chain';
import serverAuth from './serverAuth';
import settings from './settings';
import registration from './registration';
import notifications from './notifications';
import wallet from './wallet';
import leaders from './leaders';
import subscriptions from './subscriptions';
import subscribers from './subscribers';

export default combineReducers({
  auth,
  chain,
  registration,
  serverAuth,
  settings,
  notifications,
  wallet,
  leaders,
  subscriptions,
  subscribers,
});
