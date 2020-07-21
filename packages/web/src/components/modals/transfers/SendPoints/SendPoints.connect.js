import { connect } from 'react-redux';

import { transfer } from 'store/actions/commun';
import { fetchPostDonations, waitTransactionAndCheckBalance } from 'store/actions/gate';
import { openModalSelectRecipient } from 'store/actions/modals';
import { statusSelector } from 'store/selectors/common';
import { userCommunPointSelector, userPointsSelector } from 'store/selectors/wallet';

import SendPoints from './SendPoints';

export default connect(
  (state, props) => {
    const points = userPointsSelector(state);
    const communPoint = userCommunPointSelector(state);
    const { isTransferLoading, isLoading } = statusSelector('wallet')(state);

    // clear empty balances exclude sending point
    points.forEach((item, key) => {
      if (key !== props.symbol && !parseFloat(item.balance)) {
        points.delete(key);
      }
    });

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
