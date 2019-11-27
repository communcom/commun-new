import { connect } from 'react-redux';

import { openModalConvertPoint } from 'store/actions/modals';
import { getBuyPrice } from 'store/actions/gate';

import GetPointsWidget from './GetPointsWidget';

export default connect(
  null,
  {
    getBuyPrice,
    openModalConvertPoint,
  }
)(GetPointsWidget);
