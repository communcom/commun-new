import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { getBuyPrice } from 'store/actions/gate';

import GetPointsWidget from './GetPointsWidget';

export default connect(
  null,
  {
    getBuyPrice,
    openModal,
  }
)(GetPointsWidget);
