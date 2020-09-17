import { connect } from 'react-redux';

import { fetchTrendingTags } from 'store/actions/gate/tags';

import TrendingTagsWidget from './TrendingTagsWidget';

export default connect(null, { fetchTrendingTags })(TrendingTagsWidget);
