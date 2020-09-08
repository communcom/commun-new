import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';

import BasicTransferModal from './BasicTransferModal';

export default connect(state => ({
  isMobile: modeSelector(state).screenType === 'mobile',
}))(BasicTransferModal);
