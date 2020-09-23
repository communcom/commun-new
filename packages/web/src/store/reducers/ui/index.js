import { combineReducers } from 'redux';

import abTesting from './abTesting';
import comments from './comments';
import editor from './editor';
import mode from './mode';
import onboarding from './onboarding';
import wallet from './wallet';

export default combineReducers({
  comments,
  mode,
  editor,
  wallet,
  abTesting,
  onboarding,
});
