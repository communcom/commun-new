import { connect } from 'react-redux';

import { userCommunPointSelector } from 'store/selectors/wallet';
import { dataSelector } from 'store/selectors/common';
import { screenTypeDown } from 'store/selectors/ui';
import {
  getExchangeCurrenciesFull,
  getMinAmount,
  getExchangeAmount,
  createTransaction,
} from 'store/actions/gate';
import { openModalSelectToken } from 'store/actions/modals';

import ExchangeSelect from './ExchangeSelect';

export default connect(
  (state, { exchangeType }) => {
    const communPoint = userCommunPointSelector(state);

    let sellToken = null;
    let buyToken = null;

    if (exchangeType === 'SELL') {
      sellToken = { name: 'ETH' }; // commun token
      buyToken = { name: 'BTC' };
    } else {
      sellToken = { name: 'BTC' };
      buyToken = { name: 'ETH' }; // commun token
    }

    return {
      communPoint,
      exchangeCurrencies: dataSelector(['wallet', 'exchangeCurrencies'])(state),
      sellToken,
      buyToken,
      isMobile: screenTypeDown.mobileLandscape(state),
    };
  },
  {
    openModalSelectToken,
    getExchangeCurrenciesFull,
    getMinAmount,
    getExchangeAmount,
    createTransaction,
  }
)(ExchangeSelect);
