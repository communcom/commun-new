import React from 'react';
import { connect } from 'react-redux';
import { selectFeatureFlag } from '@flopflip/react-redux';

import { FEATURE_TAGS_TRENDING } from 'shared/featureFlags';
import { fetchTrendingTags } from 'store/actions/gate/tags';

import TrendingTagsWidget from './TrendingTagsWidget';

export default connect(
  state => ({
    featureFlag: selectFeatureFlag(FEATURE_TAGS_TRENDING)(state),
  }),
  { fetchTrendingTags }
)(({ featureFlag, ...props }) => (featureFlag ? <TrendingTagsWidget {...props} /> : null));
