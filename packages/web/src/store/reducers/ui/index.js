import { combineReducers } from 'redux';

import comments from './comments';
import mode from './mode';
import leaderBoard from './leaderBoard';

export default combineReducers({
  comments,
  mode,
  leaderBoard,
});
