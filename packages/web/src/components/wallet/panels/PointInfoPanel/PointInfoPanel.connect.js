import { connect } from 'react-redux';

import { COMMUN_SYMBOL } from 'shared/constants';

import { openModalConvertPoint, openModalSendPoint } from 'store/actions/modals';
import { getBalance } from 'store/actions/gate';

import { uiSelector, modeSelector } from 'store/selectors/common';
import { userPoints2Selector, userCommunPointSelector } from 'store/selectors/wallet';
import PointInfoPanel from './PointInfoPanel';

export default connect(
  (state, props) => {
    const points = userPoints2Selector(state);
    const communPoint = userCommunPointSelector(state);
    const pointSymbol = uiSelector(['wallet', 'pointInfoSymbol'])(state);
    const isMobile = modeSelector(state).screenType === 'mobile';

    points.set(COMMUN_SYMBOL, communPoint);

    const currentPoint = props.symbol ? points.get(props.symbol) : points.get(pointSymbol);

    return {
      points,
      currentPoint,
      isMobile,
    };
  },
  {
    getBalance,
    openModalConvertPoint,
    openModalSendPoint,
  }
)(PointInfoPanel);
