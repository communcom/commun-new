import { connect } from 'react-redux';

import { unbanCommunityUser } from 'store/actions/commun';

import UnbanModal from './UnbanModal';

export default connect(null, {
  unbanCommunityUser,
})(UnbanModal);
