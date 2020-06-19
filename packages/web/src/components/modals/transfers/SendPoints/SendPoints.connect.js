import { connect } from 'react-redux';

import { transfer } from 'store/actions/commun';
import { fetchPostDonations, waitTransactionAndCheckBalance } from 'store/actions/gate';
import { openModalSelectRecipient } from 'store/actions/modals';
import { statusSelector } from 'store/selectors/common';
import { userCommunPointSelector, userPositivePointsSelector } from 'store/selectors/wallet';

import SendPoints from './SendPoints';

export default connect(
  (state, props) => {
    const points = userPositivePointsSelector(state);
    const communPoint = userCommunPointSelector(state);
    const { isTransferLoading, isLoading } = statusSelector('wallet')(state);

    const sendingPoint = points.has(props.symbol) ? points.get(props.symbol) : communPoint;

    return {
      points,
      communPoint,
      sendingPoint,
      isLoading: isTransferLoading || isLoading,
    };
  },
  {
    transfer,
    waitTransactionAndCheckBalance,
    openModalSelectRecipient,
    fetchPostDonations,
  }
)(SendPoints);
