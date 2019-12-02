import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';

import ShareModal from './ShareModal';

export default connect(state => ({
  currentUserId: currentUserIdSelector(state),
}))(ShareModal);
