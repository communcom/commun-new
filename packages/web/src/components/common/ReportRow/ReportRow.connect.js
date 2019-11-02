import { connect } from 'react-redux';

import { extendedPeportSelector } from 'store/selectors/common';
import ReportRow from './ReportRow';

export default connect((state, props) => ({
  report: extendedPeportSelector(props.reportId)(state),
}))(ReportRow);
