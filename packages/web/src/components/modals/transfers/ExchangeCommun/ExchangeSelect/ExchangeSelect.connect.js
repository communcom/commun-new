import { connect } from 'react-redux';

import { userCommunPointSelector } from 'store/selectors/wallet';
import { screenTypeDown } from 'store/selectors/ui';
import {
  getMinMaxAmount,
  getExchangeAmount,
  createTransaction,
  getOrCreateClient,
  getRates,
} from 'store/actions/gate';
import { currentUserIdSelector } from 'store/selectors/auth';
import { openModalSelectToken } from 'store/actions/modals';

import ExchangeSelect from './ExchangeSelect';

export default connect(
  (state, props) => {
    const communPoint = userCommunPointSelector(state);
    const currentUserId = currentUserIdSelector(state);

    const sellToken = props.sellToken || { symbol: 'BTC', fullName: 'Bitcoin' };
    const buyToken = communPoint; // commun token

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
    getMinMaxAmount,
    getExchangeAmount,
    createTransaction,
    getOrCreateClient,
    getRates,
  }
)(ExchangeSelect);
