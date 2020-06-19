import { connect } from 'react-redux';

import { POINT_CONVERT_TYPE } from 'shared/constants';
import { convert, openCommunWallet, openWallet } from 'store/actions/commun';
import {
  getBuyPrice,
  getPointInfo,
  getSellPrice,
  waitTransactionAndCheckBalance,
} from 'store/actions/gate';
import { openModalSelectPoint } from 'store/actions/modals';
import { statusSelector } from 'store/selectors/common';
import { userCommunPointSelector, userPointsSelector } from 'store/selectors/wallet';

import ConvertPoints from './ConvertPoints';

export default connect(
  (state, props) => {
    const points = userPointsSelector(state);
    const communPoint = userCommunPointSelector(state);
    const { isTransferLoading, isLoading } = statusSelector('wallet')(state);

    // TODO: convetPoints
    const convetPoints = {};

    if (props.convertType === POINT_CONVERT_TYPE.BUY) {
      convetPoints.sellingPoint = communPoint;
      convetPoints.buyingPoint = points.has(props.symbol) ? points.get(props.symbol) : props.symbol;
    } else {
      convetPoints.sellingPoint = points.get(props.symbol);
      convetPoints.buyingPoint = communPoint;
    }

    return {
      points,
      communPoint,
      isLoading: isTransferLoading || isLoading,
      convetPoints,
    };
  },
  {
    convert,
    openWallet,
    waitTransactionAndCheckBalance,
    getSellPrice,
    getBuyPrice,
    getPointInfo,
    openModalSelectPoint,
    openCommunWallet,
  }
)(ConvertPoints);
