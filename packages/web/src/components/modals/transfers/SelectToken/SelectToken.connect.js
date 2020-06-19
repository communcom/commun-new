import { connect } from 'react-redux';

import { getExchangeCurrenciesFull } from 'store/actions/gate';
import { dataSelector } from 'store/selectors/common';

import SelectToken from './SelectToken';

export default connect(
  state => ({
    tokens: dataSelector(['wallet', 'exchangeCurrencies'])(state),
  }),
  {
    getExchangeCurrenciesFull,
  }
)(SelectToken);
