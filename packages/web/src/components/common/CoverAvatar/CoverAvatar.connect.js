import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { UIModeSelector } from 'store/selectors/ui';

import CoverAvatar from './CoverAvatar';

export default connect(
  state => ({
    isDragAndDrop: UIModeSelector('isDragAndDrop')(state),
  }),
  {
    openModal,
  }
)(CoverAvatar);
