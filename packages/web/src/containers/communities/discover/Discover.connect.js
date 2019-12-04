import { connect } from 'react-redux';

import { entityArraySelector, statusSelector } from 'store/selectors/common';
import { getCommunities } from 'store/actions/gate';

import Discover from './Discover';

export default connect(
  state => {
    const { order, isEnd, isLoading } = statusSelector('communities')(state);

    return {
      items: entityArraySelector('communities', order)(state),
      isAllowLoadMore: !isLoading && !isEnd,
    };
  },
  { getCommunities }
)(Discover);
