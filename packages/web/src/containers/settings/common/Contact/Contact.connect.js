import React from 'react';
import { connect } from 'react-redux';

import { updateProfileMeta } from 'store/actions/commun';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';
import { screenTypeDown } from 'store/selectors/ui';

import Contact from './Contact';
import ContactMobile from './ContactMobile';

export default connect(
  state => ({
    isMobile: screenTypeDown.mobileLandscape(state),
  }),
  {
    updateProfileMeta,
    fetchProfile,
    waitForTransaction,
  }
)(({ isMobile, ...props }) => (isMobile ? <ContactMobile {...props} /> : <Contact {...props} />));
