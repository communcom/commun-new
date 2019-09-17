import { connect } from 'react-redux';

import Description from './Description';

export default connect(() => {
  // TODO: replace width real data
  const isLeader = true;

  return {
    isLeader,
  };
})(Description);
