import { connect } from 'react-redux';

import { entitySelector, modeSelector } from 'store/selectors/common';

import Header from './Header';

export default connect((state, props) => ({
  community: entitySelector('communities', props.communityId)(state),
  isDesktop: modeSelector(state).screenType === 'desktop',
  // TODO: replace with info from store
  communityColor: '#eea041',
}))(Header);
