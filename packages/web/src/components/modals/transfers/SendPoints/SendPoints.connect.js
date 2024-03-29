import { connect } from 'react-redux';

import { transfer } from 'store/actions/commun';
import { fetchPostDonations, waitTransactionAndCheckBalance } from 'store/actions/gate';
import { openModalConvertPoint, openModalSelectRecipient } from 'store/actions/modals';
import { statusSelector } from 'store/selectors/common';
import { userCommunPointSelector, userPointsSelector } from 'store/selectors/wallet';

import SendPoints from './SendPoints';

export default connect(
  (state, props) => {
    const points = userPointsSelector(state);

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
    openModalConvertPoint,
    fetchPostDonations,
  }
)(SendPoints);
