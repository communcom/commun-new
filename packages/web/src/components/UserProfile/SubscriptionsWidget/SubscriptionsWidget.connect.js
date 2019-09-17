import { connect } from 'react-redux';
import { compose } from 'redux';
import { branchOnFeatureToggle } from '@flopflip/react-redux';

import { FEATURE_SUBSCRIPTIONS_WIDGET } from 'shared/feature-flags';
import SubscriptionsWidget from './SubscriptionsWidget';

export default compose(
  branchOnFeatureToggle({ flag: FEATURE_SUBSCRIPTIONS_WIDGET }),
  connect()
)(SubscriptionsWidget);
