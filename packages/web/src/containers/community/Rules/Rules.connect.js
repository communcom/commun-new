import { connect } from 'react-redux';

import Rules from './Rules';

export default connect(() => {
  // TODO: replace width real data
  const isLeader = true;

  return {
    isLeader,
  };
})(Rules);
