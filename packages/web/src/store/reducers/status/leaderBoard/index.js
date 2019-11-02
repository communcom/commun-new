import { combineReducers } from 'redux';

import proposals from './proposals';
import reports from './reports';

export default combineReducers({
  proposals,
  reports,
});
