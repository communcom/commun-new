import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { entitySelector, modeSelector } from 'store/selectors/common';

import Community from './Community';

export default connect((state, props) => ({
  community: entitySelector('communities', props.communityId)(state),
  featureFlags: selectFeatureFlags(state),
  isDesktop: modeSelector(state).screenType === 'desktop',
}))(Community);
