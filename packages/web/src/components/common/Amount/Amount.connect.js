import { connect } from 'react-redux';

import { currencySelector } from 'store/selectors/settings';

import Amount from './Amount';

export default connect((state, { currency }) => ({
  currency: currency || currencySelector(state),
}))(Amount);
