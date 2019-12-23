import { connect } from 'react-redux';

import {
  openModalConvertPoint,
  openModalExchangeCommun,
  openModalSendPoint,
} from 'store/actions/modals';
import { getBalance } from 'store/actions/gate';

import { uiSelector, modeSelector } from 'store/selectors/common';
import { userPoints2Selector, userCommunPointSelector } from 'store/selectors/wallet';
import PointInfoPanel from './PointInfoPanel';

export default connect(
  state => {
    const points = userPoints2Selector(state);
    const communPoint = userCommunPointSelector(state);
    const pointSymbol = uiSelector(['wallet', 'pointInfoSymbol'])(state);
    const isMobile = modeSelector(state).screenType === 'mobile';

    const currentPoint = points.has(pointSymbol) ? points.get(pointSymbol) : communPoint;

    return {
      points,
      currentPoint,
      isMobile,
    };
  },
  {
    getBalance,
    openModalConvertPoint,
    openModalExchangeCommun,
    openModalSendPoint,
  }
)(PointInfoPanel);
