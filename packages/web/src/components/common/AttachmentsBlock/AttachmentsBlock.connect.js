import { connect } from 'react-redux';

import { feedImageWidthSelector } from 'store/selectors/ui';

import AttachmentsBlock from './AttachmentsBlock';

export default connect(state => ({
  imageWidth: feedImageWidthSelector(state),
}))(AttachmentsBlock);
