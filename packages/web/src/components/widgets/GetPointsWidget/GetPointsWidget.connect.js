import { connect } from 'react-redux';

import { openModalConvertPoint } from 'store/actions/modals';
import { getBuyPrice } from 'store/actions/gate';
import { checkAuth } from 'store/actions/complex';

import GetPointsWidget from './GetPointsWidget';

export default connect(
  null,
  {
    checkAuth,
    getBuyPrice,
    openModalConvertPoint,
  }
)(GetPointsWidget);
