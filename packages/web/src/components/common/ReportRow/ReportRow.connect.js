import { connect } from 'react-redux';

import { extendedReportSelector } from 'store/selectors/common';
import { isDarkThemeSelector } from 'store/selectors/settings';

import ReportRow from './ReportRow';

export default connect((state, props) => ({
  report: extendedReportSelector(props.reportId)(state),
  isDark: isDarkThemeSelector(state),
}))(ReportRow);
