import { connect } from 'react-redux';

import { toggleFeatureFlags } from 'store/actions/local';

import BuildInfo from './BuildInfo';

export default connect(null, {
  toggleFeatureFlags,
})(BuildInfo);
