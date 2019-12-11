import { connect } from 'react-redux';

import { extendedReportSelector } from 'store/selectors/common';
import ReportRow from './ReportRow';

export default connect((state, props) => ({
  report: extendedReportSelector(props.reportId)(state),
}))(ReportRow);
