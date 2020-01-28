import { connect } from 'react-redux';

import { userCommunPointSelector } from 'store/selectors/wallet';
import { getCarbonStatus, waitTransactionAndCheckBalance } from 'store/actions/gate';

import ExchangeStatus from './ExchangeStatus';

export default connect(
  state => ({
    communPoint: userCommunPointSelector(state),
  }),
  {
    getCarbonStatus,
    waitTransactionAndCheckBalance,
  }
)(ExchangeStatus);
