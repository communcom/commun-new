import { combineReducers } from 'redux';

import commentsReports from './commentsReports';
import proposals from './proposals';
import reports from './reports';

export default combineReducers({
  proposals,
  reports,
  commentsReports,
});
