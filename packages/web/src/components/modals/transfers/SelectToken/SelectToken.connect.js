import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { getExchangeCurrenciesFull } from 'store/actions/gate';

import SelectToken from './SelectToken';

export default connect(
  state => ({
    tokens: dataSelector(['wallet', 'exchangeCurrencies'])(state),
  }),
  {
    getExchangeCurrenciesFull,
  }
)(SelectToken);
