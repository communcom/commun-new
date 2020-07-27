import { connect } from 'react-redux';

import { banCommunityUser } from 'store/actions/commun';

import BanModal from './BanModal';

export default connect(null, {
  banCommunityUser,
})(BanModal);
