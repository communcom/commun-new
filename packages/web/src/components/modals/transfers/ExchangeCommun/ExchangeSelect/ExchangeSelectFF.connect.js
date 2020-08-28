import React from 'react';
import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { FEATURE_EXCHANGE_COMMON_PAYMIR } from 'shared/featureFlags';

import ExchangeSelect from './ExchangeSelect.connect';
import ExchangeSelectOld from './ExchangeSelectOld.connect';

export default connect(state => ({
  featureFlags: selectFeatureFlags(state),
}))(({ featureFlags, ...props }) =>
  featureFlags[FEATURE_EXCHANGE_COMMON_PAYMIR] ? (
    <ExchangeSelect {...props} />
  ) : (
    <ExchangeSelectOld {...props} />
  )
);
