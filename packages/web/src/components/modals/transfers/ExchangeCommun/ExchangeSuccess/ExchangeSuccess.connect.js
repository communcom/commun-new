import { connect } from 'react-redux';

import { getCarbonStatus, waitTransactionAndCheckBalance } from 'store/actions/gate';
import { userCommunPointSelector } from 'store/selectors/wallet';

import ExchangeSuccess from './ExchangeSuccess';

export default connect(
  state => ({
    communPoint: userCommunPointSelector(state),
  }),
  {
    getCarbonStatus,
    waitTransactionAndCheckBalance,
  }
)(ExchangeSuccess);
