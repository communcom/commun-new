import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/common';

import ChoosePostCover from './ChoosePostCover';

export default connect(state => ({
  isDragAndDrop: uiSelector(['mode', 'isDragAndDrop'])(state),
}))(ChoosePostCover);
