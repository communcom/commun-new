import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currencySelector } from 'store/selectors/settings';

import Amount from './Amount';

export default connect(
  createSelector([currencySelector], currency => ({ currency })),
  {}
)(Amount);
