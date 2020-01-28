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
  (state, { exchangeType }) => {
    const communPoint = userCommunPointSelector(state);
    const currentUserId = currentUserIdSelector(state);

    let sellToken = null;
    let buyToken = null;

    if (exchangeType === 'SELL') {
      sellToken = communPoint; // commun token
      buyToken = { symbol: 'BTC', fullName: 'Bitcoin' };
    } else {
      sellToken = { symbol: 'BTC', fullName: 'Bitcoin' };
      buyToken = communPoint; // commun token
    }

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
