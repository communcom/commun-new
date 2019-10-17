import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { fetchLeaders } from 'store/actions/gate';

import Leaders from './Leaders';

export default connect(
  state => {
    const { items, isEnd, isLoading } = dataSelector('leaders')(state);

    return {
      leaders: items,
      isEnd,
      isLoading,
    };
  },
  {
    fetchLeaders,
  }
)(Leaders);
