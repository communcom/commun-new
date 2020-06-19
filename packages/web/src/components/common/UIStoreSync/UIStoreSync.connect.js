import { connect } from 'react-redux';

import { updateUIMode } from 'store/actions/ui/mode';

import UIStoreSync from './UIStoreSync';

export default connect(
  state => ({
    screenType: state.ui.mode.screenType,
    isOneColumnMode: state.ui.mode.isOneColumnMode,
    isDragAndDrop: state.ui.mode.isDragAndDrop,
  }),
  {
    updateUIMode,
  }
)(UIStoreSync);
