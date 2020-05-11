import { connect } from 'react-redux';

import { userCommunPointSelector } from 'store/selectors/wallet';
import { getCarbonStatus, waitTransactionAndCheckBalance } from 'store/actions/gate';

import SellSuccess from './SellSuccess';

export default connect(
  state => ({
    communPoint: userCommunPointSelector(state),
  }),
  {
    getCarbonStatus,
    waitTransactionAndCheckBalance,
  }
)(SellSuccess);
