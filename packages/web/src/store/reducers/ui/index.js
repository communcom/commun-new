import { combineReducers } from 'redux';

import comments from './comments';
import mode from './mode';
import leaderBoard from './leaderBoard';
import editor from './editor';
import wallet from './wallet';

export default combineReducers({
  comments,
  mode,
  leaderBoard,
  editor,
  wallet,
});
