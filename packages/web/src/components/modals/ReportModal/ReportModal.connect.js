import { connect } from 'react-redux';

import { report } from 'store/actions/complex/content';

import ReportModal from './ReportModal';

export default connect(
  null,
  {
    report,
  }
)(ReportModal);
