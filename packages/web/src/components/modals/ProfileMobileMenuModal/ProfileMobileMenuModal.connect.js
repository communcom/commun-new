import { connect } from 'react-redux';

import { logout } from 'store/actions/gate';

import ProfileMobileMenuModal from './ProfileMobileMenuModal';

export default connect(null, { logout })(ProfileMobileMenuModal);
