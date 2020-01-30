import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_PROFILE_ABOUT_EDIT, SHOW_MODAL_VIEW_BIO } from 'store/constants';

import Description from './Description';

export default connect(
  null,
  {
    openEditProfileAboutModal: userId => openModal(SHOW_MODAL_PROFILE_ABOUT_EDIT, { userId }),
    openViewBioModal: (username, bio, isMobile) =>
      openModal(SHOW_MODAL_VIEW_BIO, { username, bio, isMobile }),
  }
)(Description);
