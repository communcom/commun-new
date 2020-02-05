import { combineReducers } from 'redux';

import proposals from './proposals';
import reports from './reports';
import commentsReports from './commentsReports';

export default combineReducers({
  proposals,
  reports,
  commentsReports,
});
