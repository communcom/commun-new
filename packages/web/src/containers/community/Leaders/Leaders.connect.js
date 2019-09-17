import { connect } from 'react-redux';

import { fetchLeaders } from 'store/actions/gate';
import { dataSelector } from 'store/selectors/common';

import Leaders from './Leaders';

export default connect(
  state => {
    const { items, isEnd, isLoading, sequenceKey } = dataSelector('leaders')(state);

    return {
      leaders: items,
      isEnd,
      isLoading,
      sequenceKey,
    };
  },
  {
    fetchLeaders,
  }
)(Leaders);
