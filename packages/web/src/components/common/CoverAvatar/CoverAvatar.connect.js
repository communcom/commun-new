import { connect } from 'react-redux';

import { UIModeSelector } from 'store/selectors/ui';

import CoverAvatar from './CoverAvatar';

export default connect(state => ({
  isDragAndDrop: UIModeSelector('isDragAndDrop')(state),
}))(CoverAvatar);
