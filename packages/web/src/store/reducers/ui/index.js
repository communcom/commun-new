import { combineReducers } from 'redux';

import comments from './comments';
import mode from './mode';
import editor from './editor';

export default combineReducers({
  comments,
  mode,
  editor,
});
