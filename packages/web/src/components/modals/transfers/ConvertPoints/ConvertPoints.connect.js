import { connect } from 'react-redux';

import { POINT_CONVERT_TYPE, COMMUN_SYMBOL } from 'shared/constants';

import { convert, openWallet, openCommunWallet } from 'store/actions/commun';
import {
  waitTransactionAndCheckBalance,
  getSellPrice,
  getBuyPrice,
  getPointInfo,
} from 'store/actions/gate';
import { openModalSelectPoint } from 'store/actions/modals';
import { statusSelector } from 'store/selectors/common';
import {
  userPoints2Selector,
  userCommunPointSelector,
  userBalanceSelector,
} from 'store/selectors/wallet';

import ConvertPoints from './ConvertPoints';

export default connect(
  (state, props) => {
    const points = userPoints2Selector(state);
    const communPoint = userCommunPointSelector(state);
    const { isTransferLoading, isLoading } = statusSelector('wallet')(state);

    const communBalance = userBalanceSelector(state).find(point => point.symbol === COMMUN_SYMBOL);

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
      isCommunBalanceOpen: Boolean(communBalance),
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
