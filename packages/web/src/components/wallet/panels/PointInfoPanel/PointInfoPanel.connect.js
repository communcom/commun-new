import { connect } from 'react-redux';

import { openModalConvertPoint, openModalSendPoint } from 'store/actions/modals';
import { getBalance, getPointHistory } from 'store/actions/gate';

import { uiSelector, dataSelector, modeSelector } from 'store/selectors/common';
import { userPoints2Selector, userCommunPointSelector } from 'store/selectors/wallet';
import PointInfoPanel from './PointInfoPanel';

export default connect(
  (state, props) => {
    const points = userPoints2Selector(state);
    const communPoint = userCommunPointSelector(state);
    const pointSymbol = uiSelector(['wallet', 'pointInfoSymbol'])(state);
    const isMobile = modeSelector(state).screenType === 'mobile';

    const symbol = props.symbol ? props.symbol : pointSymbol;
    const currentPoint = points.has(symbol) ? points.get(symbol) : communPoint;

    const pointHistory = dataSelector(['wallet', 'pointHistory', symbol])(state);

    return {
      points,
      currentPoint,
      pointHistory,
      isMobile,
    };
  },
  {
    getBalance,
    getPointHistory,
    openModalConvertPoint,
    openModalSendPoint,
  }
)(PointInfoPanel);
