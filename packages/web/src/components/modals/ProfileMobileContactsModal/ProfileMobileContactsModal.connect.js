import { connect } from 'react-redux';

import { logout } from 'store/actions/gate';

import ProfileMobileContactsModal from './ProfileMobileContactsModal';

export default connect(null, { logout })(ProfileMobileContactsModal);
