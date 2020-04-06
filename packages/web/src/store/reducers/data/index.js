import { combineReducers } from 'redux';

import unauth from './unauth';
import auth from './auth';
import chain from './chain';
import serverAuth from './serverAuth';
import settings from './settings';
import registration from './registration';
import notifications from './notifications';
import wallet from './wallet';
import subscriptions from './subscriptions';
import subscribers from './subscribers';
import config from './config';
import createCommunity from './createCommunity';

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
