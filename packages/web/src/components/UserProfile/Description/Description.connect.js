import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_PROFILE_ABOUT_EDIT } from 'store/constants';
import { entitySelector } from 'store/selectors/common';

import Description from './Description';

export default connect(
  (state, props) => ({
    profile: entitySelector('profiles', props.userId)(state),
  }),
  {
    openEditProfileAboutModal: userId => openModal(SHOW_MODAL_PROFILE_ABOUT_EDIT, { userId }),
  }
)(Description);
