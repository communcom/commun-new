import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/common';

import FeaturesToggle from './FeaturesToggle';

export default connect(state => ({
  isFeatureFlagsShow: uiSelector('common')(state).isFeatureFlagsShow,
}))(FeaturesToggle);
