import { connect } from 'react-redux';

import { getBalance } from 'store/actions/gate';
import { showPointInfo } from 'store/actions/local';
import {
  openModalConvertPoint,
  openModalExchangeCommun,
  openModalSendPoint,
} from 'store/actions/modals';
import { modeSelector, uiSelector } from 'store/selectors/common';
import { userCommunPointSelector, userPointsSelector } from 'store/selectors/wallet';

import PointInfoPanel from './PointInfoPanel';

export default connect(
  state => {
    const points = userPointsSelector(state);
    const communPoint = userCommunPointSelector(state);
    const pointSymbol = uiSelector(['wallet', 'pointInfoSymbol'])(state);
    const isMobile = modeSelector(state).screenType === 'mobile';

    const currentPoint = points.has(pointSymbol) ? points.get(pointSymbol) : communPoint;

    return {
      points,
      communPoint,
      currentPoint,
      isMobile,
    };
  },
  {
    getBalance,
    openModalConvertPoint,
    openModalExchangeCommun,
    openModalSendPoint,
    showPointInfo,
  }
)(PointInfoPanel);
