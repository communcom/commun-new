import { connect } from 'react-redux';

import { selectCommunity } from 'store/actions/ui';

import ManageCommunityWidget from './ManageCommunityWidget';

export default connect(null, {
  selectCommunity,
})(ManageCommunityWidget);
