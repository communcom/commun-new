import { combineReducers } from 'redux';

import auth from './auth';
import chain from './chain';
import config from './config';
import createCommunity from './createCommunity';
import notifications from './notifications';
import registration from './registration';
import serverAuth from './serverAuth';
import settings from './settings';
import subscribers from './subscribers';
import subscriptions from './subscriptions';
import unauth from './unauth';
import wallet from './wallet';

export default combineReducers({
  unauth,
  auth,
  chain,
  registration,
  serverAuth,
  settings,
  notifications,
  wallet,
  subscriptions,
  subscribers,
  config,
  createCommunity,
});
