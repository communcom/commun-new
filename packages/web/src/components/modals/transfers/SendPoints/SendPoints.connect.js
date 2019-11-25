import { connect } from 'react-redux';

import { transfer } from 'store/actions/commun';
import { waitTransactionAndCheckBalance } from 'store/actions/gate';
import { openModalSelectRecipient } from 'store/actions/modals';
import { statusSelector } from 'store/selectors/common';
import { userPointsSelector, userCommunPointSelector } from 'store/selectors/wallet';

import SendPoints from './SendPoints';

export default connect(
  (state, props) => {
    const points = userPointsSelector(state);
    const communPoint = userCommunPointSelector(state);
    const { isTransferLoading, isLoading } = statusSelector('wallet')(state);

    const sendingPoint = props.symbol ? points.find(point => point.symbol === props.symbol) : null;

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
  }
)(SendPoints);
