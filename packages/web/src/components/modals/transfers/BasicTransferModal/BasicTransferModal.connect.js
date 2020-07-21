import { connect } from 'react-redux';

import { openModalConvertPoint } from 'store/actions/modals';
import { modeSelector } from 'store/selectors/common';

import BasicTransferModal from './BasicTransferModal';

export default connect(
  state => ({
    isMobile: modeSelector(state).screenType === 'mobile',
  }),
  {
    openModalConvertPoint,
  }
)(BasicTransferModal);
