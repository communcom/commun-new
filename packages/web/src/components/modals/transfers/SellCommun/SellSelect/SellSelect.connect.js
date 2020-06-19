import { connect } from 'react-redux';

import { payMirCalculate } from 'store/actions/gate';
import { openModalSelectToken } from 'store/actions/modals';
import { currentUserIdSelector } from 'store/selectors/auth';
import { screenTypeDown } from 'store/selectors/ui';
import { userCommunPointSelector } from 'store/selectors/wallet';

import SellSelect from './SellSelect';

export default connect(
  (state, props) => {
    const communPoint = userCommunPointSelector(state);
    const currentUserId = currentUserIdSelector(state);

    const sellToken = communPoint; // commun token
    const buyToken = props.buyToken || { symbol: 'BTC', fullName: 'Bitcoin' };

    return {
      currentUserId,
      communPoint,
      sellToken,
      buyToken,
      isMobile: screenTypeDown.mobileLandscape(state),
    };
  },
  {
    openModalSelectToken,
    payMirCalculate,
  }
)(SellSelect);
