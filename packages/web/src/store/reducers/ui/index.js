import { combineReducers } from 'redux';

import abTesting from './abTesting';
import comments from './comments';
import common from './common';
import editor from './editor';
import mode from './mode';
import onboarding from './onboarding';
import wallet from './wallet';

export default combineReducers({
  common,
  comments,
  mode,
  editor,
  wallet,
  abTesting,
  onboarding,
});
